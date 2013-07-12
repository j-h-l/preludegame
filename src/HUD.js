var Hud = cc.Layer.extend({
    // handle popups later
    distanceToLight: null,
    distanceLabel: null,
    tTime: null,

    ctor: function () {
        this._super();
    },

    init: function () {
        this.setTouchEnabled(false);
        this.initDistanceMeter();

        this.distanceToLight = [
            "Now you've got the flow",
            "Keep going!",
            "Not too much longer now",
            "Almost there!"
        ];
    },

    initDistanceMeter: function () {
        var s = cc.Director.getInstance().getWinSize();
        this.distanceLabel = cc.LabelTTF.create("Travelled:", "Impact", 30);
        this.distanceLabel.setPosition(cc.p(90, s.height -20));
        // this.addChild(distanceLabel, Zorder.hud, "dist");
    },

    startDisplayingDistance: function () {
        this.addChild(this.distanceLabel, Zorder.hud, "dist");
    },

    updateDist: function (t) {
        var dLabelPos = this.distanceLabel.getPosition();
        if (this.tTime === null) {
            this.tTime = cc.LabelTTF.create(t, "Impact", 30);
            this.tTime.setPosition(cc.p(dLabelPos.x+140, dLabelPos.y));
            this.addChild(this.tTime, Zorder.hud, "time");
        }
        this.tTime.setString(t);
    }

});
