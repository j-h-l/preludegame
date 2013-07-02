var StageSelect = cc.Layer.extend({
    init: function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();

        var menuItem = cc.MenuItemFont.create("New Game", this.newGame, this);
        menuItem.setPosition(cc.p(size.width /2, 30));
        var menu = cc.Menu.create(menuItem);
        menu.setPosition(cc.p(1,1));
        this.addChild(menu, 1);

        // link to playground
    },

    newGame: function () {
        var newmyPlayground = new myPlayground();
        newmyPlayground.init();
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, newmyPlayground));
        cc.log("Going to play now");
    }
});

var myStageSelect = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var sselect = new StageSelect();
        this.addChild(sselect);
        sselect.init();
    }
});
