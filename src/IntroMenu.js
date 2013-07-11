var IntroLayer = cc.Layer.extend({
    // isMouseDown:false,
    // thisisme: null,

    init:function () {
      this._super();

      var size = cc.Director.getInstance().getWinSize();
      var clayer = cc.LayerColor.create(cc.c4b(255, 233, 198, 255), size.width, size.height);
      this.addChild(clayer, 0);

      // // Set Menu
      var menuItem = cc.MenuItemFont.create("Go to StageSelect", this.toStageSelect, this);
      menuItem.setPosition(cc.p(size.width / 2, 30));
      var menu = cc.Menu.create(menuItem);
      menu.setPosition(cc.p(1,1));
      this.addChild(menu, 1);

      // Set title
      // var thisisme = cc.LabelTTF.create("I am in IntroLayer", "Impact", 38);
      // thisisme.setPosition(cc.p(size.width / 2, size.height - 40));
      // this.addChild(thisisme, 5);

      // this.setTouchEnabled(true);

    },

    toStageSelect:function () {
        var mySS = new myStageSelect();
        mySS.init();
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, mySS));
        cc.log("toStageSelect pressed");
    }
  });


var myIntro = cc.Scene.extend({
  onEnter:function () {
    this._super();
    var layer = new IntroLayer();
    this.addChild(layer);
    layer.init();
  }
});
