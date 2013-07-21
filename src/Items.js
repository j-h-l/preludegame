// coordinates objects in game space that isn't player object
var ItemsLayer = cc.Layer.extend({
  intervals: null,

  ctor: function () {
    this._super();
  },

  init: function () {
    // at set interval, insertConsumable
    this.intervals = 5;
    this.schedule(this.insertConsumable, this.intervals);
  },

  insertConsumable: function () {
    var s = cc.Director.getInstance().getWinSize();
    var makeHeavy = new Heavy();
    this.addChild(makeHeavy, Zorder.items, Tags.itemtag);
    makeHeavy.init(cc.p(s.width, s.height/2 + Math.random() * 150));

    //move it across
    // var dw = cc.Director.getInstance().getRunningScene().getChildByTag(Tags.worldtag);
    makeHeavy.physObj.SetLinearVelocity(new b2Vec2(-2,0));
    

  },

  update: function () {
      var h_items = this.getChildren();
      var object;
      for (object in h_items) {
          if (h_items[object].getTag() === Tags.itemtag) {
              h_items[object].updatePosition();
          }
      }
  }

});
