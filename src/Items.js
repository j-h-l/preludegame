// coordinates objects in game space that isn't player object
var ItemsLayer = cc.Layer.extend({
  intervals: null,

  ctor: function () {
    this._super();
  },

  init: function () {
    // at set interval, insertConsumable
    this.intervals = 3;
    this.schedule(this.insertConsumable, this.intervals);
  },

  insertConsumable: function () {
    var s = cc.Director.getInstance().getWinSize();
    var makeHeavy = new Heavy();
    this.addChild(makeHeavy, Zorder.items, Tags.itemtag);
    var randPosition = cc.p(s.width, s.height/2 + (Math.random()*2 -1) * 150);
    makeHeavy.init(randPosition);
    cc.log("consumPosition... x: " + randPosition.x  + "  y: " + randPosition.y);

    cc.AudioEngine.getInstance().playEffect(s_put_mp3, false);

    //move it across
    // var dw = cc.Director.getInstance().getRunningScene().getChildByTag(Tags.worldtag);
    var consumSpeed = new b2Vec2(- makeHeavy.speed + (Math.random() * 2 - 1) * makeHeavy.speedVar, 0);
    makeHeavy.physObj.SetLinearVelocity(consumSpeed);
    cc.log("ball speed: " + consumSpeed.x);
  },

  update: function () {
      var h_items = this.getChildren();
      // cc.log("number of consumables: " + h_items.length);
      var object;
      for (object in h_items) {
          if (h_items[object].getTag() === Tags.itemtag) {
              h_items[object].updatePosition();
          }
      }
  }

});
