var Ball = cc.Sprite.extend({
    physObj: null,
    sizeOfBall: null,

    // ctr: function () {
    //     this._super();
    // },

    init: function (pos, myPhysicsManager) {
        this.initWithFile(s_ball);//, cc.rect(0,0,45,45));
        this.sizeOfBall = 45;

        var s = cc.Director.getInstance().getWinSize();
        this.setPositionX(pos.x);
        this.setPositionY(pos.y);

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
            shapeRadius: 23,
            userData: {
                tag: Tags.balltag
            }
        };
        if (this.physObj === null) {
            this.physObj = myPhysicsManager.addBody(entityDef);
        }
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
