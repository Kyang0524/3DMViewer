import * as THREE from 'three';
import Point from "./Point.js";

class TextBoard {
    #parameters;
    #message;
    #HoldPointSizeSet = 0.1;
    #Colour = "#ffffff";
    spriteContent = null;
    constructor(Message = "Text", location = new Point(0, 0, 0), Style = new TextStyle()) {
        this.#parameters = Style.parameters;
        this.#message = Message;
        let spritey = this.#makeTextSprite(this.#message, this.#parameters);
        spritey.position.set(location.x, location.y, location.z);
        this.spriteContent = spritey.clone();
        this.#HoldPointSizeSet = Style.HoldPointSize;
        this.#Colour = Style.HoldPointColour;
    }
    #makeTextSprite(message, parameters) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext("2d");
        //Message = message;

        //Retrieve values from parameters struct;
        if (parameters === undefined) parameters = {};
        const fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 20;
        const fontfamily = parameters.hasOwnProperty("fontfamily") ? parameters["fontfamily"] : "Asial";
        const textcolour = parameters.hasOwnProperty("textcolour") ? parameters["textcolour"] : "#000000"; // black
        const backgroundcolour = parameters.hasOwnProperty("backgroundcolour") ? parameters["backgroundcolour"] : "#FFFFFF" //white
        const weigth = parameters.hasOwnProperty("weigth") ? parameters["weigth"] : "Bold";
        const borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 2;
        const borderColor = parameters.hasOwnProperty("borderColor") ? parameters["borderColor"] : "#000000";

        //Set font properties
        context.font = weigth + " " + fontsize + "px " + fontfamily;
        context.fillStyle = textcolour;

        // Calculate text width and height;
        const textWidth = context.measureText(message).width;
        const textHeight = fontsize;

        // Calculate the message board dimensions
        const boardWidth = textWidth + 40; // add padding
        const boardHeight = textHeight + 20; // add padding

        // Calculate the position to centre the message board on the canvas
        const x = (canvas.width - boardWidth) / 2;
        const y = (canvas.height - boardHeight) / 2;

        // Draw the message board background
        context.fillStyle = backgroundcolour;
        //context.fillRect(x, y, boardWidth, boardHeight);

        // Draw the message text
        context.fillStyle = textcolour;
        context.fillText(message, x + 10, y + 10 + fontsize);

        // Optionally, add a border around the message board
        context.strokeStyle = borderColor;
        context.lineWidth = borderThickness;
        //context.strokeRect(x, y, boardWidth, boardHeight);

        // Set sprite
        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 1, 1);
        return sprite;

    }
    Print(ToScene = new THREE.Scene()) {
        if (this.#parameters.textLocation) {
            Point.AddPointInstance(ToScene, Location, this.#HoldPointSizeSet, this.#Colour);
        }
        ToScene.add(this.spriteContent);
    }
}

class TextStyle {
    parameters = {
        fontsize: null,
        fontfamily: null,
        textcolour: null,
        backgroundcolour: null,
        weigth: null,
        borderThickness: null,
        borderColor: null,
        showBoard: null,
        showStroke: null,
        textLocation: null
    };
    DistanceFromPoint = 0;
    DistanceOfOffset = 1;
    constructor() {
        this.parameters = {
            fontsize: 20,
            fontfamily: "Asial",
            textcolour: "#000000", //black
            backgroundcolour: "#FFFFFF", // white
            weigth: "Bold",
            borderThickness: 2,
            borderColor: "#000000",
            showBoard: false,
            showStroke: false,
            textLocation: false
        };
        this.DistanceFromPoint = 0;
        this.DistanceOfOffset = 1;
        this.HoldPointSize = 0.1;
        this.HoldPointColour = "#000000";
        this.DisplayTextLocation = true;
    }
}

class LinearDimension {
    StPt = new Point(0, 0, 0);
    EdPt = new Point(0, 5, 0);
    DirPt = new Point(5, 2.5, 0);
    Style = new TextStyle();
    Lines = [];
    DimensionContent = "<>";
    Sprity;
    Distance;
    constructor(StartPoint = new Point(), EndPoint = new Point(), DirectionPoint = new Point(), Style = new TextStyle()) {
        this.StPt = StartPoint.ClonePt();
        this.EdPt = EndPoint.ClonePt();
        this.DirPt = DirectionPoint.ClonePt();
        this.Style = Style;
        this.Distance = Point.PointDist(this.StPt, this.EdPt);
        if (Point.IsColinear(this.StPt, this.EdPt, this.DirPt)) {
            console.log("The Points are colinear.");
            return;
        }
        const Pt4 = Point.FindPerpendicularPt(this.StPt, this.EdPt, this.DirPt);

        const Vec1 = Point.VectorCreate(this.StPt, this.EdPt, true);
        const RVec1 = Point.VectorCreate(this.EdPt, this.StPt, true);
        const Vec2 = Point.VectorCreate(Pt4, this.DirPt);

        const Pt5 = this.StPt.ClonePt().Add(Vec2, RVec1.Mul(this.Style.DistanceOfOffset));
        const Pt6 = this.EdPt.ClonePt().Add(Vec2, Vec1.Mul(this.Style.DistanceOfOffset));
        const Pt1 = this.StPt.ClonePt().Add(Vec2.ClonePt().Unitise().Mul(this.Style.DistanceFromPoint));
        const Pt2 = this.EdPt.ClonePt().Add(Vec2.ClonePt().Unitise().Mul(this.Style.DistanceFromPoint));
        const Pt7 = this.StPt.ClonePt().Add(Vec2, Vec2.ClonePt().Unitise().Mul(this.Style.DistanceOfOffset));
        const Pt8 = this.EdPt.ClonePt().Add(Vec2, Vec2.ClonePt().Unitise().Mul(this.Style.DistanceOfOffset));
        this.MessagePt = Point.PointAdd(Pt5, Pt6).Mul(0.5);
        this.Lines.push(LinearDimension.Addline(Pt5, Pt6), LinearDimension.Addline(Pt1, Pt7), LinearDimension.Addline(Pt2, Pt8));
        this.DimensionContent = "<>";
    }
    Print(ToScene = new THREE.Scene(), ReNameDimensionContent = "<>", Round = 2) //Print Dimension in the scene
    {
        this.Distance = Math.round(this.Distance * Math.pow(10, Round)) * Math.pow(0.1, Round);
        this.Distance = Number(this.Distance.toFixed(10));

        if (ReNameDimensionContent === "<>") {
            this.DimensionContent = this.Distance;
        }
        else if (ReNameDimensionContent.includes("<") && ReNameDimensionContent.includes(">")) {
            const Start = ReNameDimensionContent.indexOf("<");
            const End = ReNameDimensionContent.indexOf(">") + 1;
            this.DimensionContent = ReNameDimensionContent.slice(0, Start) +
                this.Distance +
                ReNameDimensionContent.slice(End, ReNameDimensionContent.length);
        }
        else {
            this.DimensionContent = ReNameDimensionContent;
        }
        this.Sprity = (new TextBoard(this.DimensionContent, this.MessagePt, this.Style)).Print(ToScene);
        for (let Line of this.Lines) {
            ToScene.add(Line);
        }
        if (this.Style.DisplayTextLocation) {
            Point.AddPointInstance(ToScene, this.StPt, this.Style.HoldPointSize, this.Style.HoldPointColour);
            Point.AddPointInstance(ToScene, this.EdPt, this.Style.HoldPointSize, this.Style.HoldPointColour);
        }
    }
    static Addline(Point1, Point2) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(Point1.x, Point1.y, Point1.z),
            new THREE.Vector3(Point2.x, Point2.y, Point2.z)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const line = new THREE.Line(lineGeometry, lineMaterial)
        return line;
    }
}

export { TextBoard, TextStyle, LinearDimension };
