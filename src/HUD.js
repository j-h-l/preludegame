var Hud = cc.Layer.extend({
    // also handle popups later
    distance: null,
    ctor: function () {
        this._super();
    },

    init: function () {
        this.setTouchEnabled(false);
    }
});
