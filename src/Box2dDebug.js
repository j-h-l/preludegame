// Currently box2d debug does not work in cocos2d html5
var Box2dDebugLayer = cc.Layer.extend({
    box2dworld: null,
    debugSetting: null,

    some: function () {
        this._super();
        this.box2dworld = this.getParent().getChildByTag(Tags.worldtag);
        this.setTouchEnabled(false);
        this.debugSetting = {
            color: {
                static: "red",
                dynamic: "green",
                kinematic: "orange"
            },
            fillAlpha: 0.5
        };
    },

    init: function () {
        // var s = cc.Director.getInstance().getWinSize();
        var debugdraw = new b2DebugDraw();
        // var spr = cc.Sprite.create(s_star);
        // this.addChild(spr);

        var parentDiv = document.getElementById('Cocos2dGameContainer');
        var debugCanvas = document.createElement('canvas');
        debugCanvas.setAttribute('id', 'debugCanvas');
        debugCanvas.setAttribute('width', parentDiv.style.width);
        debugCanvas.setAttribute('height', parentDiv.style.height);
        debugCanvas.setAttribute('class', "border absolute");
        parentDiv.appendChild(debugCanvas);
        debugdraw.SetSprite(debugCanvas.getContext('2d'));
        debugdraw.SetFlags(b2DebugDraw.e_shapeBit);
        debugdraw.SetFillAlpha(0.5);
        this.getParent().getChildByTag(8).boxworld.SetDebugDraw(debugdraw);
        // debugdraw.SetFlags(debugdraw.e_aabbBit);
        // this.getParent().getChildByTag(8).boxworld.DrawDebugData();

        this.setTouchEnabled(false);
    },

    draw: function () {
        this.getParent().getChildByTag(8).boxworld.DrawDebugData();
    }
});

