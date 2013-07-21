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
    this.addChild(makeHeavy);
    makeHeavy.init(cc.p(s.width, s.height/2 + Math.random() * 50));

    //move it across
    

  }

});
