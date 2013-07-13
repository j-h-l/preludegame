var Playground = cc.Layer.extend({
    myPhysicsManager: null,
    myBall: null,
    timeplayed: null,

    // ctor: function () {
        // this._super();
    // },

  init: function () {
    this._super();
    var s = cc.Director.getInstance().getWinSize();

    var imin = cc.LabelTTF.create("Click to start your journey...", "Impact", 38);
    imin.setPosition(cc.p(s.width/2, s.height/2));
    // this.addChild(imin, 1);
    this.addChild(imin, Zorder.hud, "click");

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
      // update physics manager
      this.myPhysicsManager.stepForward();

      // update Ball
      this.myBall.updateEntity();

      // update tunnel drawing
      var tun = this.getParent().getChildByTag(Tags.cavestag);
      tun.updateTunnel();

      // update timeplayed
      this.timeplayed += dt;
      var dist = this.getParent().getChildByTag(Tags.hud);
      dist.updateDist(this.timeplayed.toFixed(3));
      // cc.log(this.timeplayed.toFixed(3));

      this.myPhysicsManager.checkContact();
  },

  playSound: function () {
  }

  onTouchesBegan: function (ev) {
      if (this.getScheduler().isTargetPaused(this) && this.timeplayed === null) {
          this.resumeSchedulerAndActions();
          this.removeChildByTag("click");
          this.getParent().getChildByTag(Tags.hud).startDisplayingDistance();

          this.timeplayed = 0;
      }
      this.myBall.physObj.ApplyImpulse(new b2Vec2(0,2.45), this.myBall.physObj.GetPosition());
  },

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

    // HUD
    var myHUD = new Hud();
    this.addChild(myHUD, Zorder.hud, Tags.hud);
    myHUD.init();

    layer.schedule(layer.update);
    layer.pauseSchedulerAndActions();

  },

  onHit: function () {
      this.getChildByTag(Tags.playgroundtag).pauseSchedulerAndActions();
      this.getChildByTag(Tags.playgroundtag).setTouchEnabled(false);
      var DeadLayer = new cc.Layer();
      this.addChild(DeadLayer, Zorder.hud + 1);

      var stuckmsg = cc.LabelTTF.create("Click to try again", "Impact", 40);
      var s = cc.Director.getInstance().getWinSize();
      stuckmsg.setPosition(cc.p(s.width /2 , s.height /2 ));
      this.addChild(stuckmsg);

      DeadLayer.setTouchEnabled(true);
      DeadLayer.onTouchesBegan = function (ev) {
          var newPlayground = new myPlayground();
          cc.Director.getInstance().replaceScene(newPlayground);
      };
  }
});
