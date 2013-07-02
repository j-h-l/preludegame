b2World = Box2D.Dynamics.b2World;
b2Body = Box2D.Dynamics.b2Body;
b2BodyDef = Box2D.Dynamics.b2BodyDef;
b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
b2Vec2 = Box2D.Common.Math.b2Vec2;

var PhysicsManager = cc.Layer.extend({
    boxworld: null,
    SCALE: 30,

    PHYSICS_LOOP: 1.0 / 60.0,

    init: function () {
        this._super();
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
                new b2Vec2(0, 9.81),
                true);
        }
    },

    registerBody: function (bodyDef) {
        var body = this.boxworld.CreateBody(bodyDef);
        return body;
    },

    addBody: function (entityDef) {
        var newBodyDef = new b2BodyDef();
        newBodyDef.type = b2Body.b2_dynamicBody;
        newBodyDef.position.x = entityDef.position.x;
        newBodyDef.position.y = entityDef.position.y;

        var body = this.registerBody(newBodyDef);

        var newFix = new b2FixtureDef();
        var shape = new b2CircleShape();
        newFix.shape = shape;
        // newFix.shape.SetAsBox(); // for polygonshape
        body.CreateFixture(newFix);

        return body;
    },

    removeBody: function (body) {
        this.boxworld.DestroyBody(body);
    }
});

