var Cave = cc.Layer.extend({
    distanceTraveled: null,
    tileCount: null,
    tunnelSize: null,
    closingrate: 0.1,
    _cavesDrawn: false,

    currentSpeed: 6,
    topCave: null,
    bottomCave: null,
    caves: {
        alpha: {
            upper: null,
            lower: null
        },
        beta: {
            upper: null,
            lower: null,
        }
    },

    init: function () {
        this._super();
        var s = cc.Director.getInstance().getWinSize();
        this.setTag(Tags.cavestag);
        this.distanceTraveled = 0;
        this.tileCount = 0;
        this.tunnelSize = s.height * (4/5);
        this.sizeOfObject = this.getParent().getChildByTag(Tags.playgroundtag).myBall.sizeOfObject;

        this.initCaves();

        this.setTouchEnabled(false);
    },

    initCaves: function (caveDef) {
        var s = cc.Director.getInstance().getWinSize();

        var customDef = {
            bodyType: "kinematic",
            position: {
                x: s.width /3,
                // y: s.height
                y: 1
            },
            shape: "noisy",
            setFix: {
                friction: 0.5,
                restitution: 1.2
            },
            halfWidth: s.width /2,
            halfHeight: 15,
            numberOfJags: 1,
            jaggyMultiplier: 10,
            userData: {
                tag: Tags.bottom1,
                offset: {
                    // x: s.width /3,
                    // y: s.height
                    x: s.width/3,
                    y: 1
                },
                nodename: "alphalower",
                drawnode: null,
                verts: []
            }
        };
        
        // alpha lower
        customDef = this.noisyVertices(customDef);
        this.caves.alpha.lower = this.getParent().getChildByTag(Tags.worldtag).addBody(customDef);
        // cc.log(this.getParent().getChildByTag(Tags.worldtag).convertToPixels(this.caves.alpha.lower.GetPosition()));
        this.caves.alpha.lower.SetLinearVelocity(new b2Vec2(-this.currentSpeed, 0));
        
        // alpha upper
        customDef.position = {
            x: s.width /3,
            y: s.height
        };
        customDef.userData = {
            tag: Tags.top1,
            offset: customDef.position,
            nodename: "alphaupper",
            drawnode: null,
            verts: []
        };
        customDef = this.noisyVertices(customDef);
        this.caves.alpha.upper = this.getParent().getChildByTag(Tags.worldtag).addBody(customDef);
        this.caves.alpha.upper.SetLinearVelocity(new b2Vec2(-this.currentSpeed, 0));

        // beta lower
        customDef.position = {
            x: (s.width* 4 / 3),// + s.width,
            y: 1
        };
        customDef.userData = {
            tag: Tags.bottom2,
            offset: customDef.position,
            nodename: "betalower",
            verts: []
        };
        customDef = this.noisyVertices(customDef);
        this.caves.beta.lower = this.getParent().getChildByTag(Tags.worldtag).addBody(customDef);
        this.caves.beta.lower.SetLinearVelocity(new b2Vec2(-this.currentSpeed, 0));

        // beta upper
        customDef.position = {
            x: (s.width * 4 / 3),//+ s.width,
            y: s.height
        };
        customDef.userData = {
            tag: Tags.top2,
            offset: customDef.position,
            nodename: "betaupper",
            verts: []
        };
        customDef = this.noisyVertices(customDef);
        this.caves.beta.upper = this.getParent().getChildByTag(Tags.worldtag).addBody(customDef);
        this.caves.beta.upper.SetLinearVelocity(new b2Vec2(-this.currentSpeed, 0));
        this.drawTunnel();
    },

    noisyVertices: function (entityDef) {
        // returns entityDef with custom vertices
        var s = cc.Director.getInstance().getWinSize();

        // for now, to test, magic numbers
        // start constructing vertices from left bottom corner
        // start from position - (s.width /2)
        // var startingPos = cc.p( entityDef.position.x - (s.width /2),
                                // entityDef.position.y - (15));
        // starting from (0,0)
        var startingPos = cc.p( - entityDef.halfWidth,
                                - entityDef.halfHeight);
        var sections = entityDef.numberOfJags;

        // get perlin noise
        var noise = this.noisyPoints(sections);
        // cc.log(noise);
        // calculate midpoints of cave walls described by line eq
        var nVerts = [startingPos];
        var jFactor = entityDef.jaggyMultiplier;

        var r =1;
        for ( r ; r <= sections; r++) {
            var temp = cc.p(0,0);
            temp.x = startingPos.x + ((s.width / sections) * r);
            temp.y = startingPos.y - this.closingrate*((s.height /sections) * r);// - 0*Math.abs(noise[r-1]*jFactor));
            nVerts.push(temp);
        }
        // add top right vertice
        var last = nVerts.slice(-1)[0];
        var topRight = cc.p(last.x, startingPos.y + 2*entityDef.halfHeight);
        nVerts.push(topRight);

        // last point
        // nVerts.push(cc.p((topRight.x - (s.width /2)), topRight.y));
        nVerts.push(cc.p((startingPos.x), topRight.y));

        // test rectangle
        // var a = [cc.p(0,55), cc.p(s.width,55), cc.p(s.width,-85), cc.p(0,-85)];
        entityDef.userData.verts = nVerts;
        // cc.log("nVerts: ");
        // cc.log(nVerts);
        return entityDef;
    },

    recycleTunnel: function (caveSection) {
        // if tunnel moves off the screen (left) relocate to (right)
        // called from updateTunnel
        // 2 cave sections: alpha and beta
        // 
        // move this.caves[alphaBeta] both top of bottom
        
    },

    destroyTunnel: function () {
        // do I need this?
        // I think I'll just relocate the cave to be more memory efficient
    },

    updateTunnel: function () {
        // modify to iterate through all caves
        if (this._cavesDrawn) {
        // cc.log("start updating Tunnel");
            var world = this.getParent().getChildByTag(Tags.worldtag);
            var s = cc.Director.getInstance().getWinSize();

            var alphaBeta;
            var ab;
            for (alphaBeta in this.caves) {
                for (ab in this.caves[alphaBeta]) {
                    if (this.caves[alphaBeta][ab] !== null) {

                    // var offset = world.convertToPixels(currentCaveData.offset);
                    // var currentPos = this.getChildByTag(nodename).getPosition();
                    var bodyPosition = this.caves[alphaBeta][ab].GetPosition();
                    // cc.log(bodyPosition.x * world.MtoPRatio);
                    if (bodyPosition.x < -((s.width  /2) / world.MtoPRatio)) {
                        // reposition the Tunnel
                        // this.recycleTunnel(this.caves[alphaBeta]);

                        var newPosition = new b2Vec2(bodyPosition.x + 2*s.width/world.MtoPRatio, bodyPosition.y);
                        this.caves[alphaBeta][ab].SetPosition(newPosition);
                        // cc.log("tada");
                    }
                    
                    var currentCaveData = this.caves[alphaBeta][ab].m_fixtureList.m_userData;
                    var nodename = currentCaveData.nodename;
                    var offset = currentCaveData.offset;
                    var newPos = world.convertToPixels(bodyPosition);
                    // cc.log("nodePosition: " + this.getChildByTag(76).getPosition());
                    // cc.log("Cave Position: ");
                    // cc.log(currentPos);
                    var correctedPos = {
                        // x: currentPos.x - (newPos.x - offset.x),
                        // y: currentPos.y - (newPos.y - offset.y)
                        x: newPos.x - offset.x,
                        y: newPos.y - offset.y
                    };
                    // this.getChildByTag(76).setPosition(correctedPos);
                    // var ctag = currentCaveData.tag;
                    // this.caves.alpha[ab].setPosition(correctedPos);
                    // this.getChildByTag(nodename).setPosition(correctedPos);

                    this.getChildByTag(nodename).setPosition(correctedPos);
                    // cc.log(this.getChildByTag(nodename).getPosition());
                    // cc.log("New Position (x): " + this.getChildByTag(nodename).getPosition().x);
                    }
                }
            }
        }
    },



    // drawTunnel can be used as debug draw on cocos2d html5 since it doesn't
    // support debugdraw method yet (as of v2.1.4)
    drawTunnel: function () {
        var physicsManager = this.getParent().getChildByTag(Tags.worldtag);
        var bodies = physicsManager.boxworld.GetBodyList();

        var c;
        for (c in this.caves){
        var e;
        for (e in this.caves[c]) {
            if (this.caves[c][e] !== null) {
                var partCave = this.caves[c][e];
                var partTag = partCave.m_fixtureList.m_userData.tag;
                var partOffset = physicsManager.convertToMeters(partCave.m_fixtureList.m_userData.offset);
                var partNode = partCave.m_fixtureList.m_userData.nodename;

                var poly = cc.DrawNode.create();
                this.addChild(poly, Zorder.platform, partNode);

                // cc.log("DrawTunnel, Position:");
                // cc.log(partCave.GetPosition());
                var b = partCave.m_fixtureList;
                if (b.m_shape !== null && b.m_shape.b2PolygonShape !== undefined) {
                    var currentBodyPos = partCave.GetPosition();
                    // cc.log(currentBodyPos);
                    var vertices = b.m_shape.m_vertices;
                    var ccpArray = [];
                    var eachV = 0;
                    for (eachV ; eachV < vertices.length ; eachV++) {
                        var absoluteVect = {};
                        if (vertices.length <= 4) {
                            absoluteVec = {
                                x: currentBodyPos.x + vertices[eachV].x,
                                y: currentBodyPos.y + vertices[eachV].y
                            };
                            // absoluteVec = vertices[eachV];
                        }
                        else {
                            absoluteVec = vertices[eachV];
                        }
                        var vert = physicsManager.convertToPixels(absoluteVec);
                        ccpArray.push(vert);
                    }
                    // cc.log(ccpArray);
                    poly.drawPoly(ccpArray, cc.c4f(1,0,1,1), 1, cc.c4f(0,1,0,1));
                    // cc.log("inside drawTunnel (ccpArray): (relative to drawnode)");
                    // cc.log(ccpArray);
                    // cc.log("drawnode position");
                    // cc.log(poly.getPosition());
                }
            }
        }
        }

        this._cavesDrawn = true;
        // cc.log("finished drawing");
        // cc.log(this.noisyPoints(10));
    },

    // takes number of subsections you want to create
    // returns "smooth" randomness from Perlin noise
    noisyPoints: function (numSubs) {
        var s = cc.Director.getInstance().getWinSize();
        var sectional = s.width / numSubs;
        var randomY = Math.random();
        var randomZ = Math.random();
        var perlin = new PerlinNoise();
        var gen = [];
        var iter = 0;
        for (iter; iter < numSubs; iter++) {
            gen.push(perlin.noise((iter*sectional) / s.width, randomY, randomZ));
        }
        // cc.log(gen);
        return gen;
    },


    b2Vec2ToCCP: function (vec) {
        var ccp = cc.p(vec.x, vec.y);
        return ccp;
    }
});

