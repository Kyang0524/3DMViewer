import * as THREE from 'three';

class Point {
    x; y; z;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Add(...points) {
        for (let pt of points) {
            this.x += pt.x;
            this.y += pt.y;
            this.z += pt.z;
        }
        return this;
    }
    ClonePt() {
        return new Point(this.x, this.y, this.z);
    }
    Dist(Point) {
        return Math.sqrt(
            Math.pow((this.x - Point.x), 2) +
            Math.pow((this.y - Point.y), 2) +
            Math.pow((this.z - Point.z), 2)

        )
    }
    Mul(scale = 1.0) {
        return {
            x: this.x * scale,
            y: this.y * scale,
            z: this.z * scale
        }
    }
    Unitise() {
        const Unit = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x /= Unit;
        this.y /= Unit;
        this.z /= Unit;
        return this;
    }
    static PointDist(Point1, Point2) {
        return Math.sqrt(
            Math.pow((Point1.x - Point2.x), 2) +
            Math.pow((Point1.y - Point2.y), 2) +
            Math.pow((Point1.z - Point2.z), 2));
    }
    static PointAdd(Pt, Vector) {
        return new Point(Pt.x + Vector.x, Pt.y + Vector.y, Pt.z + Vector.z);
    }
    static PointMul(Pt, scale = 1.0) {
        return new Point(Pt.x * scale, Pt.y * scale, Pt.x * scale);
    }
    static IsColinear(Pt1 = new Point(), Pt2 = new Point(), Pt3 = new Point()) {
        const X1 = Pt1.x - Pt2.x;
        const Y1 = Pt1.y - Pt2.y;
        const Z1 = Pt1.z - Pt2.z;
        const X2 = Pt1.x - Pt3.x;
        const Y2 = Pt1.y - Pt3.y;
        const Z2 = Pt1.z - Pt3.z;

        if (X1 / X2 == Y1 / Y2 && Y1 / Y2 == Z1 / Z2) {
            return true;
        }
        else {
            return false;
        }
    }
    static FindPerpendicularPt(StartPoint, EndPoint, DirectionPoint) {
        const a = EndPoint.x - StartPoint.x;
        const b = EndPoint.y - StartPoint.y;
        const c = EndPoint.z - StartPoint.z;
        const t = ((DirectionPoint.x - StartPoint.x) * a +
            (DirectionPoint.y - StartPoint.y) * b +
            (DirectionPoint.z - StartPoint.z) * c) / (a * a + b * b + c * c);

        const Point4 = {
            x: StartPoint.x + t * (EndPoint.x - StartPoint.x),
            y: StartPoint.y + t * (EndPoint.y - StartPoint.y),
            z: StartPoint.z + t * (EndPoint.z - StartPoint.z)
        };
        return Point4;
    }
    static VectorCreate(StartPoint = new Point(), EndPoint = new Point(), Unitify = false) {
        if (Unitify) {
            const Dist = Point.PointDist(StartPoint, EndPoint);
            return new Point((EndPoint.x - StartPoint.x) / Dist,
                (EndPoint.y - StartPoint.y) / Dist,
                (EndPoint.z - StartPoint.z) / Dist);
        }
        else {
            return new Point(EndPoint.x - StartPoint.x,
                EndPoint.y - StartPoint.y,
                EndPoint.z - StartPoint.z)
        }
    }
    static AddPointInstance(scene = new THREE.Scene(), Pt = new Point(), Size = 0.1, colour = 0xff0000) {
        const PointGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(Pt.x, Pt.y, Pt.z)]);
        const PointMaterial = new THREE.PointsMaterial({ color: colour, size: Size });
        const THREEPt = new THREE.Points(PointGeometry, PointMaterial);
        scene.add(THREEPt);
    }
}

export default Point;