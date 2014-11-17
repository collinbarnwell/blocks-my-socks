var EYE = vec3.fromValues(0, 10, 6);
var LOOK = vec3.fromValues(0, 0, 0);
var UP = vec3.fromValues(0, 0, 1);

var lookstart = vec3.fromValues(0, 0, 0);
var eyestart = vec3.fromValues(0, 10, 6);

var TOP = 1;
var BOTTOM = -1;
var LEFT = -1;
var RIGHT = 1;
var NEAR = 1;

var YSIZ = 256;
var XSIZ = 256;
var XSTEP = (RIGHT - LEFT) / XSIZ;
var YSTEP = (TOP - BOTTOM) / YSIZ;

var BACKGROUND = vec3.fromValues(.2*255, .2 * 255, 255);
var ANTIALIAS = false;
var LIGHT1 = true;
var LIGHT2 = true;
var num = 0;

var MYSCENE = new Scene(1);
var shadow_count = 0;
var total = 0;

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Hit.prototype = new Scene();
// Ray.prototype = new Scene();
// Camera.prototype = new Scene();
// Camera.prototype = new Scene();
// Shape.prototype = new Scene();
// Material.prototype = new Scene();
// GroundPlane.prototype = new Shape();
// Sphere.prototype = new Shape();

// Hit.prototype = MYSCENE;
// Ray.prototype = MYSCENE;
// Camera.prototype = MYSCENE;
// Camera.prototype = MYSCENE;
// Shape.prototype = MYSCENE;
// Material.prototype = MYSCENE;
// GroundPlane.prototype = new Shape();
// Sphere.prototype = new Shape();


function Scene(which) {
  var mat = mat4.create();
  mat4.scale(mat, mat, vec3.fromValues(4, .5, 1));
  mat4.invert(mat, mat);

  var mat2 = mat4.create();
  mat4.translate(mat2, mat2, vec3.fromValues(-2, -2, 2));
  mat4.scale(mat2, mat2, vec3.fromValues(1, 1, .1));
  mat4.invert(mat2, mat2);

  var transmat =  mat4.create();
  mat4.translate(transmat, transmat, vec3.fromValues(0, -10, 0));
  mat4.invert(transmat, transmat);

  var transmat2 =  mat4.create();
  mat4.translate(transmat2, transmat2, vec3.fromValues(0, 5, 0));
  mat4.invert(transmat2, transmat2);

  this.LIGHTS = [
    // new Light(0, 0, 10,
                  // 1, 1, 1,
                  // 1, 1, 1,
                  // 1, 1, 1),
    new Light(LIGHT1X, LIGHT1Y, LIGHT1Z,
                          .5, .5, .5,
                          .5, .5, .5,
                          .5, .5, .5),
    new Light(LIGHT2X, LIGHT2Y, LIGHT2Z,
                          .25, .25, .25,
                          .25, .25, .25,
                          .25, .25, .25),
    // new Light(4, 4, 4,
    //           1, 1, 1,
    //           1, 1, 1,
    //           1, 1, 1))
  ];

  if (which == 1) {
    this.SHAPES = [
      new GroundPlane(1, .2, new Material('jade'), 
                             new Material('pewter')), 
      // new GroundPlane(1, .2, mat),
      new Sphere(vec3.fromValues(2, 4, 1), 1, new Material('pewter')),

      new Sphere(vec3.fromValues(0, 0, 0), 1, new Material('red plastic'), mat),
      new Sphere(vec3.fromValues(0, 0, 4), 2, new Material('red plastic'), mat4.create(), 1),
      new Sphere(vec3.fromValues(-2, 2, 0), 2, new Material('red plastic'), null, 2),
      // 4 cubes
      new Cube(vec3.fromValues(-2, -10, 6), 3, .5, 3, new Material('jade')),
      new Cube(vec3.fromValues(0, 2, 1), 3, 1, 1, new Material('brass'), transmat2),
      new Cube(vec3.fromValues(1, 6, 1), 2, .5, 2, new Material('pewter'), false),
      new Cube(vec3.fromValues(0, 0, 0), 8, 8, 8, new Material('red plastic'), transmat),
    ];
  }
  else if (which == 2) {
    this.SHAPES = [
      new GroundPlane(1, .2, new Material('jade'), 
                             new Material('pewter')), 
      new Cylinder(1, 5, new Material('brass')),
      new Sphere(vec3.fromValues(3, -3, 4), 2, new Material('jade')),
      new Sphere(vec3.fromValues(5, 4, 1), 2, new Material('brass')),
      new Sphere(vec3.fromValues(5, -4, 7), 2, new Material('brass')),
      new Sphere(vec3.fromValues(-5, -4, 5), 2, new Material('pewter')),
      // 4 cubes
      new Cube(vec3.fromValues(0, 0, 5), 2, 2, 2, new Material('red plastic')),
      new Cube(vec3.fromValues(3, 3, 0), 1, 3, 4, new Material('jade')),
      new Cube(vec3.fromValues(-2, -3, 1), 2, 8, 1, new Material('red plastic')),
      new Cube(vec3.fromValues(-4, -5, 3), 2, 2, 2, new Material('red plastic')),
    ];
  }
  else if (which == 3) {
    this.SHAPES = [
      // new GroundPlane(1, .2, new Material('jade'), 
      //                    new Material('pewter')), 
      new Sphere(vec3.fromValues(0, 0, 4), 2, new Material('brass')),
      new Sphere(vec3.fromValues(0, 0, 0), 1, new Material('brass')),
      // new Cube(vec3.fromValues(-3, -3, -3), 10, 10, 1, new Material('brass'))
    ];
  }
  else if (which == 4) {
    this.SHAPES = [
      new Cylinder(1, 10, new Material('brass')),      
    ];
  }
  else {
    this.SHAPES = [new Cone(new Material('brass'))];
  }

  this.updateView = function() {
    var d = vec3.dist(LOOK, EYE);

    LOOK[0] = lookstart[0] + Math.cos(ROTATION)*FORWARD_SHIFT - Math.sin(ROTATION)*RIGHT_SHIFT;
    LOOK[1] = lookstart[1] + Math.sin(ROTATION)*FORWARD_SHIFT - Math.cos(ROTATION)*RIGHT_SHIFT;
    LOOK[2] = HEIGHT;

    EYE[0] = LOOK[0] + d*Math.cos(ROTATION);
    EYE[1] = LOOK[1] + d*Math.sin(ROTATION);
    EYE[2] = LOOK[2] + HEIGHT*Math.cos(VERT_ROTATION);

    this.LIGHTS = [];
    if (LIGHT1) {
      this.LIGHTS.push(new Light(LIGHT1X, LIGHT1Y, LIGHT1Z,
                          .5, .5, .5,
                          .5, .5, .5,
                          .5, .5, .5))
    }
    if (LIGHT2) {
      this.LIGHTS.push(new Light(LIGHT2X, LIGHT2Y, LIGHT2Z,
                          .25, .25, .25,
                          .25, .25, .25,
                          .25, .25, .25))
    }
    return;
  }
}

function Shape() {
  this.worldToModel = mat4.create();

  this.transform = function(iray) {
    var out = vec4.create();
    var iray3 = iray.dir;
    var iray4 = vec4.fromValues(iray3[0], iray3[1], iray3[2], 0); // x,y,z,0 for vectors
    vec4.transformMat4(out, iray4, this.worldToModel);
    iray.dir = vec3.fromValues(out[0], out[1], out[2]);

    var out2 = vec4.create();
    var iiray3 = iray.start;
    var iiray4 = vec4.fromValues(iiray3[0], iiray3[1], iiray3[2], 1); // x,y,z,1 for points
    vec4.transformMat4(out2, iiray4, this.worldToModel);
    iray.start = vec3.fromValues(out2[0], out2[1], out2[2]);

    return iray;
  }
}

function GroundPlane(ggap, linewidth, gridMat, gapMat, newmat) {
  Shape.call(this); // Calls constructor for Shape
  if (newmat)
    this.worldToModel = newmat;

  this.gridgap = ggap;
  this.linewidth = linewidth;

  this.gridMat = gridMat;
  this.gapMat = gapMat;

  this.getColor = function(point, normal, gap) {
    if (gap)
      return this.gapMat.getColor(point, normal);
    else
      return this.gridMat.getColor(point, normal);
  }

  this.findHit = function(iray, m_only) {
    var ray = this.transform(iray);

    var m = -ray.start[2]/ray.dir[2];
    if (m > 0) {

      if (m_only)
        return m;

      // var linecolor = vec3.fromValues(0, 255, 0);
      // var gapcolor = vec3.fromValues(255, 255, 255);
      vec3.scale(intersection, ray.dir, m);

      var SQSTEPX = intersection[0]/this.gridgap;
      var SQSTEPY = intersection[1]/this.gridgap;

      var normal = vec3.fromValues(0, 0, 1);

      if (SQSTEPX-Math.floor(SQSTEPX) < this.linewidth || 
          (SQSTEPY-Math.floor(SQSTEPY) < this.linewidth))
        h = new Hit(m, intersection, normal, this.getColor(intersection, normal, false));
      else
        h = new Hit(m, intersection, normal, this.getColor(intersection, normal, true));

      ray.checkClosestHit(h);
    }
    return;
  }
}

function Cube(corner, height, width, depth, material, newmat) {
  Shape.call(this);
  if (newmat)
    this.worldToModel = newmat;

  this.corner = corner;
  this.material = material;
  this.z = height;
  this.y = depth;
  this.x = width;

  this.getColor = function(point, normal) {
    return this.material.getColor(point, normal);
  }

  this.findHit = function(ray, m_only) {
    this.transform(ray);

    if (m_only)
      ms = [];
    // top 
    var planorm = vec3.fromValues(0, 0, 1);
    var pointMinusStart = vec3.create();
    var point = vec3.create();
    var point_on_plane = vec3.fromValues(this.corner[0], this.corner[1], this.corner[2]+this.z);
    
    vec3.subtract(pointMinusStart, point_on_plane, ray.start);
    var m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    var point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[0] > this.corner[0]) && (point[0] < (this.corner[0] + this.x)) && 
        (point[1] < this.corner[1]) && (point[1] > (this.corner[1] - this.y))) {
        if (m_only) {
          ms.push(m);
        } else {
          h = new Hit(m, point, planorm, this.getColor(point, planorm));
          ray.checkClosestHit(h);
        }
    }
    // bottom
    var planorm = vec3.fromValues(0, 0, -1);
    var pointMinusStart = vec3.create();
    var point = vec3.create();
    var point_on_plane = this.corner;

    vec3.subtract(pointMinusStart, point_on_plane, ray.start);
    var m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    var point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[0] > this.corner[0]) && (point[0] < (this.corner[0] + this.x)) && 
        (point[1] < this.corner[1]) && (point[1] > (this.corner[1] - this.y))) {
        if (m_only) {
          ms.push(m);
        } else {
          h = new Hit(m, point, planorm, this.getColor(point, planorm));
          ray.checkClosestHit(h);
        }
    }
    // front
    planorm = vec3.fromValues(0, 1, 0);
    pointMinusStart = vec3.create();
    point = vec3.create();
    point_on_plane = this.corner;
    
    vec3.sub(pointMinusStart, point_on_plane, ray.start);
    m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[2] > this.corner[2] && point[2] < this.corner[2] + this.z) && 
        (point[0] > this.corner[0] && point[0] < this.corner[0] + this.x)) {
      if (m_only) {
        ms.push(m);
      } else {
        h = new Hit(m, point, planorm, this.getColor(point, planorm));
        ray.checkClosestHit(h);
      }
    }
    // back
    planorm = vec3.fromValues(0, -1, 0);
    pointMinusStart = vec3.create();
    point = vec3.create();
    point_on_plane = vec3.fromValues(this.corner[0], this.corner[1] - this.y, this.corner[2]);
    
    vec3.sub(pointMinusStart, point_on_plane, ray.start);
    m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[2] > this.corner[2] && point[2] < this.corner[2] + this.z) && 
        (point[0] > this.corner[0] && point[0] < this.corner[0] + this.x)) {
      if (m_only) {
        ms.push(m);
      } else {
        h = new Hit(m, point, planorm, this.getColor(point, planorm));
        ray.checkClosestHit(h);
      }
    }
    // left
    planorm = vec3.fromValues(-1, 0, 0);
    pointMinusStart = vec3.create();
    point = vec3.create();
    point_on_plane = this.corner;
    
    vec3.sub(pointMinusStart, point_on_plane, ray.start);
    m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[2] > this.corner[2] && point[2] < this.corner[2] + this.z) && 
        (point[1] < this.corner[1] && point[1] > this.corner[1] - this.y)) {
      if (m_only) {
        ms.push(m);
      } else {
        h = new Hit(m, point, planorm, this.getColor(point, planorm));
        ray.checkClosestHit(h);
      }
    }
    // right
    planorm = vec3.fromValues(1, 0, 0);
    pointMinusStart = vec3.create();
    point = vec3.create();
    point_on_plane = vec3.fromValues(this.corner[0] + this.x, this.corner[1], this.corner[2]);
    
    vec3.sub(pointMinusStart, point_on_plane, ray.start);
    m = vec3.dot(pointMinusStart, planorm)/vec3.dot(planorm, ray.dir);
    point = vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    if ((m > 0) && (point[2] > this.corner[2] && point[2] < this.corner[2] + this.z) && 
        (point[1] < this.corner[1] && point[1] > this.corner[1] - this.y)) {
      if (m_only) {
        ms.push(m);
      } else {      
        h = new Hit(m, point, planorm, planorm);
        ray.checkClosestHit(h);
      }
    }

    if (m_only)
      return Math.max.apply(Math, ms);   
    return; 
  }
}

function Cylinder(rad, height, material, newmat) {
  Shape.call(this);
  if (newmat)
    this.worldToModel = newmat;

  this.rad = rad;
  this.height = height;
  this.material = material;

  this.getColor = function(point, normal) {
    var color = this.material.getColor(point, normal);
    // console.log(color);
    return color;
  }

  this.findHit = function(ray, m_only) {
    // ALL hits not kept track of, only closest
    this.transform(ray);

    var radSquared = this.rad * this.rad;
    var a = ray.dir[0]*ray.dir[0] + ray.dir[1]*ray.dir[1];
    var b = 2*ray.start[0]*ray.dir[0] + 2*ray.dir[1]*ray.start[1];
    var c = ray.start[0] * ray.start[0] + ray.start[1]*ray.start[1] - radSquared;

    var det = b*b - 4*a*c;

    if (det < 0)
      return;
    else if (det == 0) {
      var ms = [];
      ms.push(-b/(2*a));
    }
    else {
      var ms = [];
      ms.push((-b - det)/(2*a));
      ms.push((-b + det)/(2*a));
    }

    var M = 10000;
    for (var i = 0; i < ms.length; i++) {
      var mm = ms.pop();
      var zval = ray.start[2] + ray.dir[2] * mm;
      if (zval < 0 || zval > this.height || mm < 0)
        continue;
      if (mm < M)
        M = mm;
    }

    if (M == 10000)
      return;

    if (m_only)
      return M;
    
    var xval = ray.start[0] + ray.dir[0] * M;
    var yval = ray.start[1] + ray.dir[1] * M;
    var zval = ray.start[2] + ray.dir[2] * M;

    var normal = vec3.fromValues(xval, yval, 0);
    var point = vec3.fromValues(xval, yval, zval);
    vec3.normalize(normal, normal);

    h = new Hit(M, point, normal, this.getColor(point, normal));
    ray.checkClosestHit(h);
  }
}

function Cone(material) {
  Shape.call(this);
  this.material = material;

  this.getColor = function(point, normal) {
    return this.material.getColor(point, normal);
  }

  this.findHit = function(ray, m_only) {
    // ALL hits not kept track of, only closest
    this.transform(ray);

    var a = ray.dir[0]*ray.dir[0] + ray.dir[1]*ray.dir[1] - ray.dir[2]*ray.dir[2];
    var b = 2*ray.start[0]*ray.dir[0] + 2*ray.dir[1]*ray.start[1] - 2*ray.dir[2]*ray.start[2];
    var c = ray.start[0] * ray.start[0] + ray.start[1]*ray.start[1] - 2*ray.start[2]*ray.start[2];

    var det = b*b - 4*a*c;

    if (det < 0)
      return;
    else if (det == 0) {
      var ms = [];
      ms.push(-b/(2*a));
    }
    else {
      var ms = [];
      ms.push((-b - det)/(2*a));
      ms.push((-b + det)/(2*a));
    }

    var M = 10000;
    for (var i = 0; i < ms.length; i++) {
      var mm = ms.pop();
      var zval = ray.start[2] + ray.dir[2] * mm;
      if (mm < 0)
        continue;
      if (mm < M)
        M = mm;
    }

    if (M == 10000)
      return;

    if (m_only)
      return M;
    
    var xval = ray.start[0] + ray.dir[0] * M;
    var yval = ray.start[1] + ray.dir[1] * M;
    var zval = ray.start[2] + ray.dir[2] * M;

    var normend = vec3.fromValues(2*xval, 2*yval, 0);
    var point = vec3.fromValues(xval, yval, zval);
    var normal = vec3.create();
    vec3.sub(normal, point, normend);
    vec3.normalize(normal, normal);
    vec3.normalize(normal, normal);

    h = new Hit(M, point, normal, this.getColor(point, normal));
    ray.checkClosestHit(h);
  }
}

function Sphere(center, rad, material, newmat, pattern) {
  Shape.call(this); // Calls constructor for Shape
  if (newmat)
    this.worldToModel = newmat;

  this.center = center;
  this.rad = rad;
  this.material = material;

  if (pattern)
    this.pattern = pattern;


  this.getColor = function(point, normal) {
    // return vec3.fromValues(255, 0, 50);
    if (this.pattern == 1) {
      if ((point[0]+5)%0.2 < 0.1)
        m = new Material('jade');
      else
        m = new Material('brass');
      return m.getColor(point, normal);
    }
    if (this.pattern == 2) {
      if ( ((point[0] + 5)%.2 < .1 && (point[1] + 5)%.2 < .1) ||
            ((point[0] + 5)%.2 > .1 && (point[1] + 5)%.2 > .1))
        m = new Material('pewter');
      else
        m = new Material('red plastic');
      return m.getColor(point, normal);
    }
    return this.material.getColor(point, normal);
  }

  this.findHit = function(ray, m_only) {
    this.transform(ray); // this is probably a problem!!

    var orgToSphere = vec3.create();
    vec3.sub(orgToSphere, center, ray.start);
    var L2 = vec3.dot(orgToSphere, orgToSphere);
    var tcaS = vec3.dot(orgToSphere, ray.dir);

    if (L2 > this.rad) {
      if (tcaS < 0)
        return;
    }

    var DL2 = vec3.dot(ray.dir, ray.dir);
    var tca2 = (tcaS * tcaS) / DL2;
    var LM2 = L2 - tca2;

    var radSquared = this.rad * this.rad;

    if (LM2 > radSquared)
      return;

    // Will hit somewhere; currently finding out where
    var L2hc = radSquared - LM2;
    if (L2 > radSquared)
      var m = (tcaS/DL2) - Math.sqrt(L2hc/DL2);
    else
      var m = (tcaS/DL2) + Math.sqrt(L2hc/DL2);
    
    if (m_only)
      return m;

    var point = vec3.create();
    vec3.scaleAndAdd(point, ray.start, ray.dir, m);

    var normal = vec3.create();
    vec3.sub(normal, point, this.center);
    vec3.normalize(normal, normal);
    h = new Hit(m, point, normal, this.getColor(point, normal));

    ray.checkClosestHit(h);
  }
}

function Hit(m, point, normal, color) {
  this.m = m;
  this.point = point;
  this.color = color;
  this.normal = normal;
}

function Ray(start, end) {
  MYSCENE.SHAPES = MYSCENE.SHAPES;
  // this.prototype = MYSCENE;
  this.start = start;
  var result = intersection = vec3.create();
  vec3.sub(result, end, start);
  this.dir = vec3.normalize(result, result);
  this.hits = [];

  this.checkShapes = function() {
    for (var i = 0; i < MYSCENE.SHAPES.length; i++) {
      MYSCENE.SHAPES[i].findHit(this, false);
    }
    return;
  }

  this.inShadow = function(hit_point) {
    // ray intersection bug
    var pt = vec3.create();
    vec3.scaleAndAdd(pt, hit_point, this.dir, -1.00001)
    /////////////////
    var lightM = vec3.dist(pt, this.start);
    ms = [];
    for (var i = 0; i < MYSCENE.SHAPES.length; i++) {
      ms.push(MYSCENE.SHAPES[i].findHit(this, true));
    }

    for (var i = 0; i < ms.length; i++) {
      if ((ms[i]) && (ms[i] < lightM)) {
        return true;
      }
    }
    return false;
  }

  this.checkClosestHit = function(h) {
    if (!(this.closestHit) || (h.m < this.closestHit.m))
      this.closestHit = h;
    this.hits.push(h);
    return;
  }
}

function Camera(eye, lookat, up) {
  var result1 = vec3.create();
  var result2 = vec3.create();
  var result3 = vec3.create();

  vec3.sub(result1, EYE, LOOK);   // right
  vec3.normalize(result1, result1);
  this.N = result1;
  vec3.cross(result2, UP, this.N);
  vec3.normalize(result2, result2);
  this.U = result2;
  vec3.cross(result3, this.N, this.U);  // forward
  this.V = result3;

  this.findShade = function(r) {
    hit = r.checkShapes();
    if (hit) {
      return hit.color;
    }
    else {
      return null;
    }
  }

  this.setLowerLeft = function() {
    var leftU = vec3.create();
    var bottV = vec3.create();
    var nearN = vec3.create();
    var result = vec3.create();
    var result1 = vec3.create();
    var result2 = vec3.create();
    var lower_left = vec3.create();
    var weightedU = vec3.create();
    var weightedV = vec3.create();

    vec3.scale(leftU, this.U, LEFT);
    vec3.scale(bottV, this.V, BOTTOM);
    vec3.scale(nearN, this.N, -NEAR);
    vec3.add(result1, leftU, bottV);
    vec3.add(result2, nearN, EYE);
    vec3.add(lower_left, result2, result1);
    this.lower_left = lower_left;
  }

  this.antiAlias = function(x, y) {
    var weightedU = vec3.create();
    var weightedV = vec3.create();
    var result = vec3.create();
    var LLSquare = vec3.create();

    vec3.scale(weightedU, this.U, XSTEP*x);
    vec3.scale(weightedV, this.V, YSTEP*y);
    vec3.add(result, weightedU, weightedV);
    vec3.add(LLSquare, result, this.lower_left);

    var colors = new Float32Array([0, 0, 0]);

    for (var i = 0; i<4; i++) {
      for (var j = 0; j < 4; j++) {
        var end = vec3.create();
        var xoff = vec3.create();
        var yoff = vec3.create();
        var totOff = vec3.create();

        vec3.scale(xoff, this.U, (XSTEP * Math.random()*.25 + .25*XSTEP*i));
        vec3.scale(yoff, this.V, (YSTEP * Math.random()*.25 + .25*YSTEP*j));
        vec3.add(totOff, xoff, yoff);

        vec3.add(end, totOff, LLSquare);
        var r = new Ray(EYE, end);

        r.checkShapes();

        if (r.closestHit) {
          colors[0] += r.closestHit.color[0];
          colors[1] += r.closestHit.color[1];
          colors[2] += r.closestHit.color[2];
        } else {
          colors[0] += BACKGROUND[0];
          colors[1] += BACKGROUND[1];
          colors[2] += BACKGROUND[2];         
        }
      }
    }
    colors[0] = colors[0]/16;
    colors[1] = colors[1]/16;
    colors[2] = colors[2]/16;
    return colors;
  }

  this.alias = function(x, y) {
    var colors = new Float32Array([0, 0, 0]);
    var r = this.makeRayFromEye(x, y);

    r.checkShapes();

    if (r.closestHit) {
      colors[0] = r.closestHit.color[0];
      colors[1] = r.closestHit.color[1];
      colors[2] = r.closestHit.color[2];
    } else {
      colors[0] = BACKGROUND[0];
      colors[1] = BACKGROUND[1];
      colors[2] = BACKGROUND[2];         
    }
    return colors;
  }

  this.makeRayFromEye = function (x, y) {
    var weightedU = vec3.create();
    var weightedV = vec3.create();
    var result = vec3.create();

    vec3.scale(weightedU, this.U, XSTEP*(.5+x));
    vec3.scale(weightedV, this.V, YSTEP*(.5+y));
    vec3.add(result, weightedU, weightedV);
    vec3.add(result, result, this.lower_left);
    return new Ray(EYE, result);
  }
}

function Material(string) {
  if (string == 'red plastic') {
    this.k_e = vec3.fromValues(0, 0, 0);
    this.k_a = vec3.fromValues(.1, .1, .1);
    this.k_d = vec3.fromValues(.6, 0, 0);
    this.k_s = vec3.fromValues(.6, .6, .6);
    this.shiny = 100;
  }
  else if (string == 'brass') {
    this.k_e = vec3.fromValues(0, 0, 0);
    this.k_a = vec3.fromValues(0.329412, 0.223529, 0.027451);
    this.k_d = vec3.fromValues(0.780392, 0.568627, 0.113725);
    this.k_s = vec3.fromValues(0.992157, 0.941176, 0.807843);
    this.shiny = 27.8974;
  }
  else if (string == 'pewter') {
    this.k_e = vec3.fromValues(0, 0, 0);
    this.k_a = vec3.fromValues(0.105882, 0.058824, 0.113725);
    this.k_d = vec3.fromValues(0.427451, 0.470588, 0.541176);
    this.k_s = vec3.fromValues(0.333333, 0.333333, 0.521569);
    this.shiny = 9.84615;
  }
  else if (string == 'jade') {
    this.k_e = vec3.fromValues(0, 0, 0);
    this.k_a = vec3.fromValues(0.135,    0.2225,   0.1575);
    this.k_d = vec3.fromValues(0.54,     0.89,     0.63);
    this.k_s = vec3.fromValues(0.316228, 0.316228, 0.316228);
    this.shiny = 12.8;    
  }
  else {
    throw 'Material does not exist';
  }

  this.getColor = function(point, normal) {
    var color = vec3.create();

    if (point[2] + .001 > 0 && point[2] - .001 < 0 && point[0] + .001 > 0 && point[0] - .001 < 0 && point[1] + .001 > 0 && point[1] - .001 < 0)
      debugger;

    for (var i = 0; i < MYSCENE.LIGHTS.length; i++) {
      var amb = vec3.create();
      var dif = vec3.create();
      var spe = vec3.create();
      var lightV = vec3.create();
      var eyeV = vec3.create();
      var hV = vec3.create();

      vec3.mul(amb, this.k_a, MYSCENE.LIGHTS[i].ka);

      r = new Ray(MYSCENE.LIGHTS[i].point, point)

      if (!r.inShadow(point)) {
        shadow_count++;
        vec3.sub(lightV, MYSCENE.LIGHTS[i].point, point);
        vec3.normalize(lightV, lightV);

        vec3.mul(dif, this.k_d, MYSCENE.LIGHTS[i].kd);
        var normDotL = vec3.dot(normal, lightV);
        normDotL = Math.max(normDotL, 0);
        vec3.scale(dif, dif, normDotL);

        vec3.mul(spe, this.k_s, MYSCENE.LIGHTS[i].ks);
        vec3.sub(eyeV, EYE, point);
        vec3.normalize(eyeV, eyeV);
        vec3.add(hV, lightV, eyeV);
        vec3.normalize(hV, hV);
        var nDotH = Math.max(vec3.dot(hV, normal), 0);
        vec3.scale(spe, spe, Math.pow(nDotH, this.shiny));

        vec3.add(color, dif, color);
        vec3.add(color, spe, color);
      }
      total++;

      // vec3.add(color, amb, color);
    }

    vec3.mul(color, color, vec3.fromValues(255, 255, 255));

    if (color[0] > 255)
      color[0] = 255;
    if (color[1] > 255)
      color[1] = 255;
    if (color[2] > 255)
      color[2] = 255;

    return color;
  }
}

function Light(x, y, z, kar, kag, kab, kdr, kdg, kdb, ksr, ksg, ksb) {
  this.point = vec3.fromValues(x, y, z);
  this.ka = vec3.fromValues(kar, kag, kdr);
  this.kd = vec3.fromValues(kdg, kdb, ksr);
  this.ks = vec3.fromValues(ksr, ksg, ksb);
}
