var consumable = cc.Sprite.extend({
    speed: 0,
    speedVar: 0,

    physObj: null,

    ctor: function () {
        this._super();
    },



    appearance: null, //Override for customized particles

    useAbility: function (onPlayer) {
        cc.log("Implement this for each consumable");
    },

    fetchPlayer: function () {
        var ds = cc.Director.getInstance().getRunningScene();
        var player = ds.getChildByTag(Tags.playgroundtag).myBall;
        return player;
    }
});


var Heavy = consumable.extend({
    growthFactor: 1.09,

    ctor: function () {
        this._super();
    },

    init: function (pos) {
        // cc.SpriteFrameCache().getInstance().addSpriteFrames(s_ball);
        var d = cc.Director.getInstance();
        var s = d.getWinSize();
        var myPhysicsManager = d.getRunningScene().getChildByTag(Tags.worldtag);

        this.speed = 4;
        this.speedVar = 0.5;

        this.setUpAppearance();

        this.setPositionX(pos.x);
        this.setPositionY(pos.y);

        var entityDef = {
            bodyType: "dynamic",
            // bodyType: "kinematic",
            position: {
                x: this.getPositionX(),
                y: this.getPositionY()
            },
            setFix: {
                // density: 1.0,
                friction: 1.0,
                restitution: 9.2
            },
            shape: "circle",
            shapeRadius: 23,
            userData: {
                tag: Tags.itemtag,
                type: "heavier",
                sprite: this
            }
        };
        if (this.physObj === null) {
            this.physObj = myPhysicsManager.addBody(entityDef);
            // this.physObj.SetGravityScale(0);
            this.physObj.GetFixtureList().SetSensor(true);
        }


    },

    setUpAppearance: function () {
        this.initWithFile(s_ball);

        // emit unique particles // subtle effect
        // var s = cc.Director.getInstance().getWinSize();
        // var sunParticle = cc.ParticleSun.create();
        // sunParticle.setPosition(this.getPosition());
        // sunParticle.setTexture(cc.TextureCache.getInstance().addImage(s_star));
        // this.addChild(sunParticle, Zorder.player);
    },

    useAbility: function () {
        // when there is a collision, update player with ability and remove itself
        // cc.log("useAbility");
        var b = cc.Director.getInstance().getRunningScene().getChildByTag(Tags.playgroundtag).myBall;
        b.setFlapStrength(b.getFlapStrength() - 0.19);
        b.numItemsConsumed += 1;

        // make player bigger (fatter in animation later)
        var fatter = cc.ScaleBy.create(0.5, this.growthFactor);
        var easeInF = cc.EaseElasticIn.create(fatter, 0.5);
        b.runAction(easeInF);
        // increase physObj radius
        var currentRadius = b.physObj.GetFixtureList().GetShape().GetRadius();
        b.physObj.GetFixtureList().GetShape().SetRadius(currentRadius * this.growthFactor);

        // play sound effect
        cc.AudioEngine.getInstance().playEffect(s_pickup_mp3, false);
        cc.AudioEngine.getInstance().playEffect(s_bigger_mp3, false);


        this.physObj.GetWorld().DestroyBody(this.physObj);
        this.removeFromParent(this);
    },

    updatePosition: function () {
        var pManager = cc.Director.getInstance().getRunningScene().getChildByTag(Tags.worldtag);

        this.setPosition(pManager.convertToPixels(this.physObj.GetPosition()));
    }
});
