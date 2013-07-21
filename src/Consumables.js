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
        var player = this.getParent().getChildByTag(Tags.playgroundtag).myBall;
        return player;
    }
});


var Heavy = consumable.extend({

    ctor: function () {
        this._super();
    },

    init: function (pos) {
        // cc.SpriteFrameCache().getInstance().addSpriteFrames(s_ball);
        var d = cc.Director.getInstance();
        var s = d.getWinSize();
        var myPhysicsManager = d.getRunningScene().getChildByTag(Tags.worldtag);

        this.speed = 1;
        this.speedVar = 0.3;

        this.initWithFile(s_ball); // temporary

        this.setPositionX(pos.x);
        this.setPositionY(pos.y);

        var entityDef = {
            // bodyType: "dynamic",
            bodyType: "kinematic",
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
                sprite: this
            }
        };
        if (this.physObj === null) {
            this.physObj = myPhysicsManager.addBody(entityDef);
        }


    },

    appearance: function () {
        // emit unique particles // subtle effect
        var s = cc.Director.getInstance().getWinSize();
        var sunParticle = cc.ParticleSun.create();
        sunParticle.setPosition(this.getPosition());
        sunParticle.setTexture(cc.TextureCache.getInstance().addImage(s_star));
        this.addChild(sunParticle, Zorder.player);
    },

    useAbility: function () {
        // when there is a collision, update player with ability and remove itself
        this.removeFromParent(this);
    }
});
