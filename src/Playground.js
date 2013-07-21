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

    var simplebackground = cc.Sprite.create(s_simpleback);
    simplebackground.setPosition(cc.p(s.width/2, s.height/2));
    this.addChild(simplebackground, Zorder.far_back);

    var imin = cc.LabelTTF.create("Click to start your journey...", "Impact", 38);
    imin.setPosition(cc.p(s.width/2, s.height/2));
    // imin.setColor(cc.white);
    this.addChild(imin, Zorder.hud, "click");

    // var bground = cc.TextureCache.getInstance().addImage(bg_gravel);
    // this.addChild(bground, Zorder.hud);

    this.addBallForForceTesting();
    this.createRainEmitter();
    // this.differentParticleEmitter();

    this.setTouchEnabled(true);
    // this.schedule(this.update);

  },

  createRainEmitter: function () {
      var s = cc.Director.getInstance().getWinSize();
      var fireEmitter = cc.ParticleRain.create();
      fireEmitter.setPosition(cc.p(s.width / 2, s.height));
      // fireEmitter.setStartColor(cc.c4f(0.62, 1, 0, 0.15));
      // fireEmitter.setStartColorVar(cc.c4f(1, 1, 1, 0));
      // fireEmitter.setEndColor(cc.c4f(0.91, 1, 0.91, 0));
      // fireEmitter.setEndColorVar(cc.c4f(0.78, 0.86, 0.94, 0));
      fireEmitter.setTexture(cc.TextureCache.getInstance().addImage(s_star));
      this.addChild(fireEmitter, Zorder.background, "rainPart");
      cc.log("emitter created");
  },

  differentParticleEmitter: function () {
      var s = cc.Director.getInstance().getWinSize();
      // Particle configuration
      // ----------------------
      var emitter = new cc.ParticleSystemQuad();
      emitter.initWithTotalParticles(223);
      emitter.setLife(0.461);
      emitter.setLifeVar(4.671);
      emitter.setStartSize(0);
      emitter.setStartSizeVar(16);
      emitter.setEndSize(40);
      emitter.setEndSizeVar(0);
      emitter.setAngle(239);
      emitter.setAngleVar(116);

      // emittertype : Mode A
      // -----------
      emitter.setDuration(-1); //forever
      // =============================
      // Gravity mode Configuration
      // ---------------------
      emitter.modeA = new cc.Particle.ModeA();
      emitter.setSpeed(0);
      emitter.setSpeedVar(0);
      emitter.setGravity(cc.p(-20,0));
      emitter.setRadialAccel(0);
      emitter.setRadialAccelVar(0);
      emitter.setTangentialAccel(0);
      emitter.setTangentialAccelVar(0);
      // ==============================
      // Emitter Location
      // ----------------
      // source_pos_y: 265
      // variance: -64
      // source_pos_x: 539
      // variance: 544
      // emitter.setSourcePosition(cc.p(539, 265));
      // emitter.setPosVar(cc.p(544,-64));
      emitter.setSourcePosition(cc.p(s.width/2, s.height/2));
      emitter.setPosVar(cc.p(100, -64));
      // ===============================
      // Particle Color
      // --------------
      // Start rgba
      // 0.62, 1, 0, 0.15
      // Finish
      // 0.91, 1, 0.91, 0
      // Start variance
      // 1, 1, 1, 0
      // Finish variance
      // 0.78, 0.86, 0.94, 0
      // -------------------
      emitter.setStartColor(cc.c4f(0.62, 1, 0, 0.15));
      emitter.setStartColorVar(cc.c4f(1, 1, 1, 0));
      emitter.setEndColor(cc.c4f(0.91, 1, 0.91, 0));
      emitter.setEndColorVar(cc.c4f(0.78, 0.86, 0.94, 0));
      // Blend function
      // --------------
      // source: GL_SRC_ALPHA
      // destination: GL_ONE
      emitter.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
      // normal
      // additive
      emitter.setBlendAdditive(true);
      // emitter.setTexture(cc.TextureCache.getInstance().addImage(s_star));
      emitter.setTexture(cc.TextureCache.getInstance().addImage(s_wdot));
      // var image = new cc.Texture2D();
      // emitter.setPosition(cc.p(s.width/2, s.height/2));
      emitter.setPosition(cc.p(0,0));
      emitter.setEmissionRate(30);
      this.addChild(emitter, Zorder.far_back);
      cc.log("started emitter");

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
      
      // update items if it exists
      var items = this.getParent().getChildByTag(Tags.items);
      items.update();

      this.myPhysicsManager.checkContact();
  },

  playMusic: function () {
      cc.log("start playing sound");
      cc.AudioEngine.getInstance().playMusic(xylophone_mp3, true);
  },

  stopMusic: function () {
      cc.log("stop playing music");
      cc.AudioEngine.getInstance().stopMusic();
  },

  onTouchesBegan: function (ev) {
      if (this.getScheduler().isTargetPaused(this) && this.timeplayed === null) {
          this.timeplayed = 0;

          this.resumeSchedulerAndActions();
          this.getParent().getChildByTag(Tags.items).resumeSchedulerAndActions();
          this.playMusic();
          this.removeChildByTag("click");
          this.getParent().getChildByTag(Tags.hud).startDisplayingDistance();
      }
      // this.myBall.physObj.ApplyImpulse(new b2Vec2(0,2.45), this.myBall.physObj.GetPosition());
      this.myBall.flap();
      // this.getChildByTag("rainPart").setTangentialAccel(5);
  },

  onTouchesEnded: function (ev) {
      // this.getChildByTag("rainPart").setAngle(0);
      
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
    // var layer = new Playground();
    var layer = new Playground(cc.c4b(255,155,0,155));
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

    // items Layer
    var myItemsLayer = new ItemsLayer();
    this.addChild(myItemsLayer, Zorder.items, Tags.items);
    myItemsLayer.init();
    myItemsLayer.pauseSchedulerAndActions();

    layer.schedule(layer.update);
    layer.pauseSchedulerAndActions();

  },

  onHit: function () {
      function tryAgainMsg() {
          var d = cc.Director.getInstance().getRunningScene();

          var stuckmsg = cc.LabelTTF.create("Click to try again", "Impact", 40);
          stuckmsg.setPosition(cc.p(s.width /2 , s.height /2 - 80));
          this.addChild(stuckmsg, Zorder.text);

          var endTime = d.getChildByTag(Tags.playgroundtag).timeplayed;
          var numItems = d.getChildByTag(Tags.playgroundtag).myBall.numItemsConsumed;
          var totalScore;
          if (numItems > 0) {
              totalScore = (endTime * numItems) * 100;
          }
          else {
              totalScore = (endTime * 100) * 100;
          }
          totalScore = totalScore.toFixed(0);
          var scoreTxt = "Total score for this run: " + totalScore;

          var scoreLabel = cc.LabelTTF.create(scoreTxt, "Impact", 34);
          scoreLabel.setPosition(cc.p(s.width /2, s.height / 2 +10));
          this.addChild(scoreLabel, Zorder.text);
      }

      var s = cc.Director.getInstance().getWinSize();
      this.getChildByTag(Tags.playgroundtag).pauseSchedulerAndActions();
      this.getChildByTag(Tags.playgroundtag).setTouchEnabled(false);

      cc.Director.getInstance().getRunningScene().getChildByTag(Tags.hud).removeChildByTag("time");
      cc.Director.getInstance().getRunningScene().getChildByTag(Tags.hud).removeChildByTag("dist");

      this.getChildByTag(Tags.items).pauseSchedulerAndActions();
      var DeadLayer = new cc.Layer();
      this.addChild(DeadLayer, Zorder.hud + 1);

      this.getChildByTag(Tags.playgroundtag).differentParticleEmitter();

      var gameoverScreen = cc.Sprite.create(s_gameover);
      gameoverScreen.setPosition(cc.p(s.width / 2, s.height /2));
      gameoverScreen.setScale(0);
      DeadLayer.addChild(gameoverScreen, Zorder.hud);

      // Set up actions for game over screen
      var rotate = cc.RotateBy.create(1, 2*360);
      var makeOriginalSize = cc.ScaleTo.create(1, 1);
      var fade = cc.FadeIn.create(0.5);
      // enable touch after the animation
      var addTexts = cc.CallFunc.create(tryAgainMsg, this);
      var enableTouch = cc.CallFunc.create(DeadLayer.setTouchEnabled, DeadLayer, true);
      var spawn = cc.Spawn.create(rotate, makeOriginalSize, fade);
      var seq = cc.Sequence.create(spawn, addTexts, enableTouch);

      gameoverScreen.runAction(seq);


      this.getChildByTag(Tags.playgroundtag).stopMusic();


      // DeadLayer.setTouchEnabled(true);
      DeadLayer.onTouchesBegan = function (ev) {
          var newPlayground = new myPlayground();
          cc.Director.getInstance().replaceScene(newPlayground);
      };
  }
});
