var nnnn;
var glRight;

var VSHADER_SOURCEr =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

var FSHADER_SOURCEr =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform int u_isTexture; \n' +							// texture/not-texture flag
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  if(u_isTexture > 0) {  \n' +
  '  	 gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '  } \n' +
  '  else { \n' +
  '	 	 gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0); \n' +
  '  } \n' +
  '}\n';


var u_isTexture = 0;							// ==0 false--use fixed colors in frag shader
																	// ==1 true --use texture-mapping in frag shader
var u_isTextureID = 0;						// GPU location of this uniform var

function main() {
//==============================================================================
  var canvasr = document.getElementById('right');
  var glr = getWebGLContext(canvasr);
  if (!glr) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  if (!initShaders(glr, VSHADER_SOURCEr, FSHADER_SOURCEr)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  var n = initVertexBuffers(glr);
  if (n < 0) {
    console.log('Failed to set the vertex information (right)');
    return;
  }
	u_isTextureID = glr.getUniformLocation(glr.program, 'u_isTexture');
  if (!u_isTextureID) {
    console.log('Failed to get the GPU storage location of u_isTexture');
    return false;
  }
  glr.clearColor(0.0, 0.0, 0.0, 1.0);				
  // gl.enable(gl.DEPTH_TEST); // CAREFUL! don't do depth tests for 2D!

  if (!initTextures(glr, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }
	// Draw the WebGL preview (right) and ray-traced result (left).
  // drawLeft(gl,n);
  nnnn = n;
  glRight = glr;

  // initLeft();
  drawRayTracer(glr,n);
}

function initVertexBuffers(gl) {
//==============================================================================
// 4 vertices for a texture-mapped 'quad' (square) to fill almost all of the CVV
  var verticesTexCoords = new Float32Array([
    // Quad vertex coordinates(x,y in CVV); texture coordinates tx,ty

    -0.95,  0.95,   	0.0, 1.0,				// upper left corner,
    -0.95, -0.95,   	0.0, 0.0,				// lower left corner,
     0.95,  0.95,   	1.0, 1.0,				// upper right corner,
     0.95, -0.95,   	1.0, 0.0,				// lower left corner.
  ]);
  var n = 4; // The number of vertices

  console.log(n);
  // Create the vertex buffer object in the GPU
  var vertexTexCoordBufferID = gl.createBuffer();
  if (!vertexTexCoordBufferID) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the this vertex buffer object to target (ARRAY_BUFFER).  
  // (Why 'ARRAY_BUFFER'? Because our array holds vertex attribute values.
  //	Our only other target choice: 'ELEMENT_ARRAY_BUFFER' for an array that 
  // holds indices into another array that holds vertex attribute values.)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBufferID);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_PositionID = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_PositionID < 0) {
    console.log('Failed to get the GPU storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_PositionID, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_PositionID);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoordID = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoordID < 0) {
    console.log('Failed to get the GPU storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoordID, 2, gl.FLOAT, false, FSIZE*4, FSIZE*2);
  // Enable the assignment of the buffer object
  gl.enableVertexAttribArray(a_TexCoordID);

  return n;
}

function initTextures(gl, n) {
//==============================================================================
  var textureID = gl.createTexture();   // Create a texture object 
  if (!textureID) {
    console.log('Failed to create the texture object on the GPU');
    return false;
  }

  // Get the storage location of u_Sampler
  var u_SamplerID = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_SamplerID) {
    console.log('Failed to get the GPU storage location of u_Sampler');
    return false;
  }
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object for texture');
    return false;
  }
  // Here, the book's texture-mapping code uses the JavaScript 'Image' object 
  // to read an RGB image from a JPG file.  It seems that file-reading is the
  // *ONLY* way to create an 'Image' object -- we can't create one from an
  // array of pixel values.
  //  SEE: http://www.proglogic.com/learn/javascript/lesson10.php
	//				http://www.w3schools.com/jsref/dom_obj_image.asp

  // myImg = new Uint8Array(XSIZ*YSIZ*3);  // r,g,b; r,g,b; r,g,b pixels
  myImg = new Float32Array(XSIZ*YSIZ*3);  // r,g,b; r,g,b; r,g,b pixels
  cam = new Camera(EYE, LOOK, UP);

  for(var j=0; j< YSIZ; j++) {          // for the j-th row of pixels
    for(var i=0; i< XSIZ; i++) {        // and the i-th pixel on that row,
      var idx = (j*XSIZ + i)*3;         // pixel (i,j) array index (red)      
      cam.setLowerLeft();

      if (ANTIALIAS)
        pixelColor = cam.antiAlias(i, j);
      else    
        pixelColor = cam.alias(i, j);

      myImg[idx   ] = pixelColor[0];                // 0 <= red <= 255
      myImg[idx +1] = pixelColor[1];                // 0 <= grn <= 255
      myImg[idx +2] = pixelColor[2];                // 0 <= blu <= 255 
        // findShade w xyz args to return color ^^^
    }
  }

  console.log(shadow_count/total);

  myImgFinal = new Uint8Array(XSIZ*YSIZ*3);
  for (var i=0; i< XSIZ*YSIZ*3; i++) {
    myImgFinal[i] = myImg[i];
  }

  // Enable texture unit0 for our use
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object we made in initTextures() to the target
  gl.bindTexture(gl.TEXTURE_2D, textureID);
  // Load the texture image into the GPU
  gl.texImage2D(gl.TEXTURE_2D, 	//  'target'--the use of this texture
  							0, 							//  MIP-map level (default: 0)
  							gl.RGB, 				// GPU's data format (RGB? RGBA? etc)
								XSIZ,						// image width in pixels,
								YSIZ,						// image height in pixels,
								0,							// byte offset to start of data
  							gl.RGB, 				// source/input data format (RGB? RGBA?)
  							gl.UNSIGNED_BYTE, 	// data type for each color channel				
								myImgFinal);	// data source.
								
  // Set the WebGL texture-filtering parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture unit 0 to be driVen by the sampler
  gl.uniform1i(u_SamplerID, 0);
  // drawLeft(gl, n);
  // browserResize();
  drawRayTracer(gl, n);
  return true;
}

function drawRayTracer(gl, nV) {
  // gl.viewport(gl.drawingBufferWidth/2,        // Viewport lower-left corner
  //             0,                              // location(in pixels)
  //             gl.drawingBufferWidth/2,        // viewport width, height.
  //             gl.drawingBufferHeight);
  gl.uniform1i(u_isTextureID, 1);         // DO use texture,
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, nV);  // Draw the textured rectangle
}
