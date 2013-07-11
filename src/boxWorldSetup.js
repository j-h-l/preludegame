var b2World = Box2D.Dynamics.b2World;
var b2Body = Box2D.Dynamics.b2Body;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2MassData = Box2D.Collision.Shapes.b2MassData;

var PhysicsManager = cc.Layer.extend({
    // todo: optimize scaling for movement
    boxworld: null,
    MtoPRatio: 50,

    PHYSICS_LOOP: 1.0 / 60.0,

    init: function () {
        this._super();
        this.setTouchEnabled(false);
    },

// box2d world setup
    initWorld: function (gravity) {
        if (gravity !== null && typeof gravity === 'b2Vec2') {
            this.boxworld = new b2World(
                gravity,   // gravity
                true);                 // allow sleep
        }
        else {
            this.boxworld = new b2World(
                new b2Vec2(0, -10),
                false);
        }
    },

    addBody: function (entityDef) {
        var bodyDef = this.makeBodyDef(entityDef);
        var body = this.createBody(bodyDef);
        var newFix = this.defineFixture(entityDef);

        body.CreateFixture(newFix);
        // body.ResetMassData();

        return body;
    },

    makeBodyDef: function (entityDef) {
        var newBodyDef = new b2BodyDef();

        var bodyType = {
            "dynamic": b2Body.b2_dynamicBody,
            "static": b2Body.b2_staticBody,
            "kinematic": b2Body.b2_kinematicBody
        };
        if (entityDef.bodyType !== null) {
            newBodyDef.type = bodyType[entityDef.bodyType];
        }

        // translate coordinate and set in world
        var pixelPosition = new b2Vec2(entityDef.position.x, entityDef.position.y);
        var boxPosition = this.convertToMeters(pixelPosition);
        newBodyDef.position.x = boxPosition.x;
        newBodyDef.position.y = boxPosition.y;
        
        // cc.log(newBodyDef.position);
        return newBodyDef;

    },

    createBody: function (bodyDef) {
        var b = this.boxworld.CreateBody(bodyDef);
        return b;
    },

    defineFixture: function (entityDef) {
        var fixDef = new b2FixtureDef();

        if (entityDef.shape === "circle") {
            var scaledRadius = entityDef.shapeRadius / this.MtoPRatio;

            var cshape = new b2CircleShape();
            fixDef.shape = cshape;
            fixDef.shape.SetRadius(scaledRadius);
            // fixDef.isSensor = entityDef.isSensor;
            if (entityDef.userData !== undefined) {
                fixDef.userData = entityDef.userData;
            }
        }
        if (entityDef.shape === "rectangle") {
            var scaled = this.convertToMeters({x:entityDef.hx, y:entityDef.hy});
            // var scaledVec = new b2Vec2(scaled.x, scaled.y);

            var boxshape = new b2PolygonShape();
            boxshape.SetAsBox(scaled.x, scaled.y);
            fixDef.shape = boxshape;
            fixDef.userData = entityDef.userData;
        }
        if (entityDef.shape === "noisy") {
            var s = cc.Director.getInstance().getWinSize();
            var scaledArray = [];
            for (var a = 0; a<entityDef.userData.verts.length; a++) {
                scaledArray.push(
                    this.convertToMeters(
                        cc.p(entityDef.userData.verts[a].x,// - s.width,
                            entityDef.userData.verts[a].y))// - s.height))
                );
            }
            var noisyBox = new b2PolygonShape();
            fixDef.shape = noisyBox;
            noisyBox.SetAsArray(scaledArray, scaledArray.length);
            fixDef.userData = entityDef.userData;
        }
        if (entityDef.setFix !== null) {
            fixDef.friction = entityDef.friction;
            // fixDef.density = entityDef.density;
            fixDef.restitution = entityDef.restitution;
            if (entityDef.userData !== undefined) {
                fixDef.userData = entityDef.userData;
            }
        }

        // cc.log("fixDef shape: " + fixDef.shape);
        return fixDef;
    },

    convertToPixels: function (boxPos) {
        var xInM = boxPos.x * this.MtoPRatio;
        var yInM = boxPos.y * this.MtoPRatio;
        var pos = {};
        pos.x = xInM;
        pos.y = yInM;
        return pos;
    },

    convertToMeters: function (pixPos) {
        var xInP = pixPos.x * (1.0 / this.MtoPRatio);
        var yInP = pixPos.y * (1.0 / this.MtoPRatio);
        var pos = {};
        pos.x = xInP;
        pos.y = yInP;
        return pos;
    },


    removeBody: function (body) {
        this.boxworld.DestroyBody(body);
    },

    stepForward: function () {
        this.boxworld.Step(
            this.PHYSICS_LOOP,
            6,                //velocity iterations
            2                 //position iterations
        );
        // this.showContact();
        this.boxworld.ClearForces();
    },

    showContact: function () {
        var con = this.boxworld.GetContactList();
        if (con !== null) {
            cc.log(con);
        }
    }
});

