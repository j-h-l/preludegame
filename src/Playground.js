var Playground = cc.Layer.extend({
    myworld: null,
    myPhysicsManager: null,

  init: function() {
    this._super();
    var s = cc.Director.getInstance().getWinSize();

    var imin = cc.LabelTTF.create("I'm in Playground", "Impact", 38);
    imin.setPosition(cc.p(s.width/2, s.height/2));
    this.addChild(imin, 5);

    var menuItem1 = cc.MenuItemFont.create("Create particle emitter", this.createEmitter, this);
    menuItem1.setPosition(cc.p(s.width - 70, 100));
    var menu = cc.Menu.create(menuItem1);
    menu.setPosition(cc.p(1,1));
    this.addChild(menu, 1);

    // init physics manager
    // var tempPhysicsManager = new PhysicsManager();
    // tempPhysicsManager.initWorld();
    // this.myPhysicsManger = tempPhysicsManager;

    var ball = new Ball();
    ball.init(this.myPhysicsManager);
    this.addChild(ball);

    this.setTouchEnabled(true);
    
  },

  createEmitter: function () {
      var s = cc.Director.getInstance().getWinSize();
      var fireEmitter = cc.ParticleFire.create();
      fireEmitter.setPosition(cc.p(s.width / 2, s.height/2));
      fireEmitter.setTexture(cc.TextureCache.getInstance().addImage(s_greStar));
      this.addChild(fireEmitter);
      cc.log("emitter created");
  }
});

var myPlayground = cc.Scene.extend({
  onEnter: function() {
    this._super();
    var myPhysics = new PhysicsManager();
    myPhysics.init();
    myPhysics.initWorld();
    myPhysics.setTag(8);
    this.addChild(myPhysics);

    var layer = new Playground();
    layer.myPhysicsManager = myPhysics;
    this.addChild(layer);
    layer.init();


  }
});
