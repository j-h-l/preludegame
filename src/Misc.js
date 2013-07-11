Tags = {
    // layers
    worldtag: 90,
    cavestag: 91,
    playgroundtag: 92,

    // entity
    balltag: 88,

    bottom1: 76,
    top1: 77,
    bottom2: 78,
    top2: 79,

    drawnodeB1: 70,
    drawnodeT1: 71,
    drawnodeB2: 72,
    drawnodeT2: 73
};

Zorder = {
    background: 0,
    far_back: -1,
    player: 1,
    platform: 2,
    effects: 3,
    hud: 4
};

// simple implementation of Perlin Noise
// referenced from Java code provided by Ken Perlin
// http://mrl.nyu.edu/~perlin/noise/
//
// Want to use this to create some random but fairly smooth variations in
// terrain.
//
// Usage:
// var perlin = new PerlinNoise();
// var n = perlin.noise(someX, someY, someZ);
//         e.g. in my case I use ratio of (segment number / total)
//              for x (bottom seg), y (top seg)
//              and some random num between 0 and 1 for z and increasing by
//              little ever iteration
var PerlinNoise = cc.Node.extend({
    ctor: function () {
        this._super();
    },

    noise: function (x, y, z) {
        var permutation = [151,160,137,91,90,15,
           131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
           190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
           88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
           77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
           102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
           135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
           5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
           223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
           129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
           251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
           49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
           138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

        var p = new Array(512);
        var inum = 0;
        for (inum ; inum < 256 ; inum++) {
            p[256+inum] = p[inum] = permutation[inum];
        }

        // coordinates of unit cube
        var X = Math.floor(x) & 255,
            Y = Math.floor(y) & 255,
            Z = Math.floor(z) & 255;

        // relative x,y,z in cube
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        // compute fade curves for each of x,y,z
        var u = this.fade(x),
            v = this.fade(y),
            w = this.fade(z);

        // hash coordinates of the 8 cube corners
        var A  = p[X  ] + Y,
            AA = p[A  ] + Z,
            AB = p[A+1] + Z,
            B  = p[X+1] + Y,
            BA = p[B  ] + Z,
            BB = p[B+1] + Z;

        // Add blended results from 8 corners of cube
        var result = this.lerp(w, this.lerp(v, this.lerp(u, this.grad(p[AA  ], x  , y  , z  ),
                                                            this.grad(p[BA  ], x-1, y  , z  )),
                                               this.lerp(u, this.grad(p[AB  ], x  , y-1, z  ),
                                                            this.grad(p[BB  ], x-1, y-1, z  ))),
                                  this.lerp(v, this.lerp(u, this.grad(p[AA+1], x  , y  , z-1),
                                                            this.grad(p[BA+1], x-1, y  , z-1)),
                                               this.lerp(u, this.grad(p[AB+1], x  , y-1, z-1),
                                                            this.grad(p[BB+1], x-1, y-1, z-1))));

        // cc.log(result);
        return result;
    },

    fade: function (t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    },

    lerp: function (t, a, b) {
        return a + t * (b - a);
    },

    grad: function (hash, x, y, z) {
        // convert LO 4 bits of hash code into 12 gradient directions
        var h = hash & 15,
            u = h<8 ? x : y,
            v = h<4 ? y : h===12||h===14 ? x : z;
        return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
    }
});
