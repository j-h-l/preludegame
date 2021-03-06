var base = "res/";
var hd = "HD/";

var s_HelloWorld = base + hd + "HelloWorld.png";
var s_greyStar = base + hd + "greystar.png";

var s_ball = base + hd + "ball.png";
var s_star = base + hd + "star.png";
var s_wdot = base + hd + "whitedot.png";
var s_gameover = base + hd + "GameOver.png";
var s_simpleback = base + hd + "background.png";


var commonly_dir = "commonly/";
// spritesheet
var jimp = "jimp/";
var s_flupp = base + commonly_dir + jimp + "Fluppit/flupp2.png";
var s_flupp_plist = base + commonly_dir + jimp + "Fluppit/flupp2.plist";

// Background
var bg_paper = base + "creampaper/creampaper.png";
var bg_gravel = base + "patterns/gravel.jpg";
var bg_spacehull = base + "patterns/spacehull.jpg";

// Sounds
// effects
var mindchamber = "mindchamber/";
var s_swing2_mp3 = base + commonly_dir + mindchamber + "PK_swing2.mp3";
var s_swing2_ogg = base + commonly_dir + mindchamber + "PK_swing2.ogg";
var s_swing3_mp3 = base + commonly_dir + mindchamber + "PK_swing3.mp3";
var s_swing3_ogg = base + commonly_dir + mindchamber + "PK_swing3.ogg";

var soundfx = "soundfx/";
var s_bigger_mp3 = base + soundfx + "bigger.mp3";
var s_bigger_ogg = base + soundfx + "bigger.ogg";
var s_pickup_mp3 = base + soundfx + "pickup.mp3";
var s_pickup_ogg = base + soundfx + "pickup.ogg";
var s_put_mp3 = base + soundfx + "put.mp3";
var s_put_ogg = base + soundfx + "put.ogg";
// bgm
var strakat = "strakat/";
var xylophone_mp3 = base + commonly_dir + strakat + "xylophone (loop).mp3";
var xylophone_ogg = base + commonly_dir + strakat + "xylophone (loop).ogg";


var g_ressources = [
    //image
    {src:s_HelloWorld},
    {src:s_greyStar},
    {src:s_ball},
    {src:s_star},
    {src:s_wdot},
    {src:bg_paper},
    {src:s_gameover},
    // {src:s_flub},
    {src:s_flupp},

    //json
    // {src:s_flub_json},
    //plist
    {src:s_flupp_plist},

    //bgm
    {src:s_swing2_mp3},
    {src:s_swing2_ogg},
    {src:s_swing3_mp3},
    {src:s_swing3_ogg},

    //effect
    {src:xylophone_mp3},
    {src:xylophone_ogg},
    {src:s_bigger_mp3},
    {src:s_bigger_ogg},
    {src:s_pickup_mp3},
    {src:s_pickup_ogg},
    {src:s_put_mp3},
    {src:s_put_ogg}
];
