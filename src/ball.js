var Ball = cc.Sprite.extend({
    physObj: null,

    init: function (myPhysicsManager) {
        this.initWithFile(s_ball, cc.rect(0,0,45,45));

        var s = cc.Director.getInstance().getWinSize();
        this.setPositionX(s.width / 2);
        this.setPositionY(s.height / 3);

        var entityDef = {
            "position": {
                "x": this.getPositionX(),
                "y": this.getPositionY()
            }
        };
        if (this.physObj === null) {
            this.physObj = myPhysicsManager.addBody(entityDef);
        }
    }
});
