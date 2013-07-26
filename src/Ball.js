var Ball = cc.Sprite.extend({
    physObj: null,
    sizeOfBall: null,
    flyingAnimation: null,
    flapStrength: 3.05,
    numItemsConsumed: 0,

    // ctr: function () {
    //     this._super();
    // },

    init: function (pos, myPhysicsManager) {
        // this.initWithFile(s_ball);//, cc.rect(0,0,45,45));
        this.sizeOfBall = 45;

        var s = cc.Director.getInstance().getWinSize();
        this.setPositionX(pos.x);
        this.setPositionY(pos.y);
        this.setScale(0.5);

        var entityDef = {
            bodyType: "dynamic",
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
            shapeRadius: 18,
            userData: {
                tag: Tags.balltag,
                sprite: this
            }
        };
        if (this.physObj === null) {
            this.physObj = myPhysicsManager.addBody(entityDef);

            var catAndMaskP = new b2FilterData();
            catAndMaskP.categoryBits = EntityCategory.player;
            catAndMaskP.maskBits = EntityCategory.ground + EntityCategory.items;
            this.physObj.GetFixtureList().SetFilterData(catAndMaskP);
        }

        // load sprites
        // cc.SpriteFrameCache.getInstance().addSpriteFramesWithJson(Fluppit_json);
        cc.SpriteFrameCache.getInstance().addSpriteFrames(s_flupp_plist);

        var spriteSheet = new cc.SpriteBatchNode();
        spriteSheet.initWithFile(s_flupp);
        this.addChild(spriteSheet);

        this.initWithSpriteFrameName("Fluppit_00.png");
        this.setFlipX(true);

        this.flappingAnimation();

    },

    flappingAnimation: function () {
        var flyingArray = [];
        var frame = 0;
        for (frame; frame < 10; frame++) {
            var f = cc.SpriteFrameCache.getInstance().getSpriteFrame("Fluppit_0" + frame + ".png");
            flyingArray.push(f);
        }

        this.flyingAnimation = new cc.Animation();
        this.flyingAnimation.initWithSpriteFrames(flyingArray, 0.04, true);
        // this.flyingAnimation.setLoops(true);
        
        this.runAction(cc.RepeatForever.create(cc.Animate.create(this.flyingAnimation)));
        // spriteSheet.addChild(this);
    },

    flap: function () {
        this.physObj.ApplyImpulse(new b2Vec2(0, this.flapStrength), this.physObj.GetPosition());
        // will need to add check for mp3 or ogg
        var flapClips = [s_swing2_mp3, s_swing3_mp3];
        cc.AudioEngine.getInstance().playEffect(flapClips[Math.floor(Math.random()*2)], false);
        // if (this.flyingAnimation.isDone()) {
        //     this.runAction(cc.Animate.create(this.flyingAnimation));
        // }
    },

    setFlapStrength: function (strength) {
        this.flapStrength = strength;
    },

    getFlapStrength: function () {
        return this.flapStrength;
    },

    updateEntity: function () {
        var pManager = this.getParent().myPhysicsManager;
        var newPos = pManager.convertToPixels(this.physObj.GetPosition());
        this.setPositionX(newPos.x);
        this.setPositionY(newPos.y);
        // if outside visual box, destroy
        // cc.log(newPos);
    }
});
