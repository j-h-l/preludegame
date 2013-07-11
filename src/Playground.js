var Playground = cc.Layer.extend({
    myPhysicsManager: null,
    myBall: null,

    // ctor: function () {
        // this._super();
    // },

  init: function () {
    this._super();
    var s = cc.Director.getInstance().getWinSize();

    var imin = cc.LabelTTF.create("I'm in Playground", "Impact", 38);
    imin.setPosition(cc.p(s.width/2, s.height/2));
    // this.addChild(imin, 1);
    this.addChild(imin, Zorder.background);

    // var something = cc.LabelTTF.create("Second item", "Impact", 38);
    // something.setPosition(cc.p(s.width/2, 30));
    // this.addChild(something, 1);
    //
    // var menuItem1 = cc.MenuItemFont.create("Create particle emitter", this.createEmitter, this);
    // menuItem1.setPosition(cc.p(s.width - 170, 100));
    // var menu = cc.Menu.create(menuItem1);
    // menu.setPosition(cc.p(1,1));
    // this.addChild(menu, 1);

    this.addBallForForceTesting();
    this.createEmitter();

    this.setTouchEnabled(true);
    // this.schedule(this.update);

  },

  createEmitter: function () {
      var s = cc.Director.getInstance().getWinSize();
      var fireEmitter = cc.ParticleRain.create();
      fireEmitter.setPosition(cc.p(s.width / 2, s.height));
      fireEmitter.setTexture(cc.TextureCache.getInstance().addImage(s_star));
      this.addChild(fireEmitter, Zorder.far_back);
      cc.log("emitter created");
  },

  update: function (dt) {
      // cc.log("in update function");
      this.myPhysicsManager.stepForward();
      this.myBall.updateEntity();

      var tun = this.getParent().getChildByTag(Tags.cavestag);
      tun.updateTunnel();
      // this.myPhysicsManager.this
  },

  onTouchesBegan: function (ev) {
      // this.myBall.physObj.SetLinearVelocity(new b2Vec2(0,5));
      this.myBall.physObj.ApplyImpulse(new b2Vec2(0,9), this.myBall.physObj.GetPosition());
  },

  // addBall: function (pos) {
  //     var ball = new Ball();
  //     ball.init(pos, this.myPhysicsManager);
  //     ball.setTag(Tags.balltag);
  //     var linVel = new b2Vec2(5,4);
  //     ball.physObj.SetLinearVelocity(linVel);
  //     this.addChild(ball, Zorder.player);
  //     cc.log("addBall");
  // },

  addBallForForceTesting: function () {
      var ball = new Ball();
      var s = cc.Director.getInstance().getWinSize();
      var pos = {
          "x": s.width / 3,
          "y": s.height / 2
      };
      ball.init(pos, this.myPhysicsManager);
      ball.setTag(Tags.balltag);
      this.myBall = ball;
      this.addChild(ball, Zorder.player);
      cc.log("addBallForForceTesting");
  }

});

var myPlayground = cc.Scene.extend({
  onEnter: function () {
    this._super();
    // Initialize PhysicsManager
    var myPhysics = new PhysicsManager();
    myPhysics.init();
    myPhysics.initWorld();
    myPhysics.setTag(Tags.worldtag);
    this.addChild(myPhysics);

    // Initialize Box2d Debug // currently not supported in cocos2d html5
    // var myDebug = new Box2dDebugLayer();
    // this.addChild(myDebug, 100, 3);
    // myDebug.init();


    // Initialize Playground (main game character layer + touch)
    var layer = new Playground();
    layer.myPhysicsManager = myPhysics;
    // layer.myPhysicsManager.boxworld.DrawDebugData();
    this.addChild(layer, Zorder.player, Tags.playgroundtag);
    // this.addChild(layer, Zorder.player);
    // this.addChild(layer);
    layer.init();


    // Initialize Cave layer
    var myCave = new Cave();
    this.addChild(myCave, Zorder.platform, Tags.cavestag);
    myCave.init();

    // myCave.createTunnel();
    // myCave.drawDebug();

    layer.schedule(layer.update);

  }
});
