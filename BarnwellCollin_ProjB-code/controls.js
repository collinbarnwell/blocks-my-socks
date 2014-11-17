
var RIGHT_SHIFT = 0;
var FORWARD_SHIFT = 0;
var HEIGHT = 3;
var ROTATION = 0;
var VERT_ROTATION = 0;

var LIGHT1 = true;
var LIGHT2 = true;

var LIGHT1X = 0;
var LIGHT1Y = 0;
var LIGHT1Z = 10;

var LIGHT2X = 10;
var LIGHT2Y = 10;
var LIGHT2Z = 10;

document.onkeydown = checkDown;

function checkDown(e) {
  if (e.keyCode == '39')
    RIGHT_SHIFT += 1;
  else if (e.keyCode == '37')
    RIGHT_SHIFT -= 1;
  else if (e.keyCode == '38')
    FORWARD_SHIFT -= 1;
  else if (e.keyCode == '40')
    FORWARD_SHIFT += 1;

  else if (e.keyCode == '65')
    ROTATION -=.25 ;
  else if (e.keyCode == '68')
    ROTATION += .25;
  else if (e.keyCode == '87')
    HEIGHT += 1;
  else if (e.keyCode == '83')
    HEIGHT -= 1;
  else if (e.keyCode == '81')
    VERT_ROTATION -= .25;
  else if (e.keyCode == '69')
    VERT_ROTATION += .25;
  else if (e.keyCode == '90')
    ANTIALIAS = !ANTIALIAS;
  else if ((e.keyCode == '49') || (e.keyCode == '112') || (e.keyCode == '72')) { // help keys
    e.preventDefault();
    print_instructions();
  }
  else if (e.keyCode == '32')  {
    MYSCENE.updateView();
    main();
  }
  return;
}

function turnOffLight1() {
  LIGHT1 = !LIGHT1;
  console.log('Light 1 is:');
  console.log(LIGHT1);
}

function turnOffLight2() {
  LIGHT2 = !LIGHT2;
  console.log('Light 2 is:');
  console.log(LIGHT2);
}

function print_instructions() {
  var help = document.getElementById('instructions');
  if (help.style.display !== 'none') {
    help.style.display = 'none';
  }
  else {
    help.style.display = 'block';
  }
}

$(document).ready(function() {
  $('#l1x').change( function() {
    LIGHT1X = this.value;
  });
  $('#l1y').change( function() {
    LIGHT1Y = this.value;
  });
  $('#l1z').change( function() {
    LIGHT1Z = this.value;
  });
  $('#l2x').change( function() {
    LIGHT2X = this.value;
  });
  $('#l2y').change( function() {
    LIGHT2Y = this.value;
  });
  $('#l2z').change( function() {
    LIGHT2Z = this.value;
  });
});

function setScene1() {
  MYSCENE = new Scene(1);
  console.log("switched to scene 1");
}

function setScene2() {
  MYSCENE = new Scene(2);
  console.log("switched to scene 2");
}

function setScene3() {
  MYSCENE = new Scene(3);
  console.log("switched to scene 3")
}

function setScene4() {
  MYSCENE = new Scene(4);
  console.log("switched to scene 4")
}

function setScene5() {
  MYSCENE = new Scene(5);
  console.log("switched to scene 5")
}

// function browserResize() {
//   // var myCanvas = document.getElementById('left'); // get current canvas
//   // var myGL = getWebGLContext(myCanvas);             // and context:

//   // if(innerWidth > 2*innerHeight) {  // fit to brower-window height
//   //   myCanvas.width = innerHeight-20;
//   //   myCanvas.height = innerHeight-20;
//   // }
//   // else {  // fit canvas to browser-window width
//   //   myCanvas.width = innerWidth/2-20;
//   //   myCanvas.height = 0.5*innerWidth-20;
//   // }

//   var myCanvas = document.getElementById('right'); // get current canvas
//   var myGL = getWebGLContext(myCanvas);             // and context:

//   //Make a square canvas/CVV fill the SMALLER of the width/2 or height:
//   if(innerWidth > innerHeight) {  // fit to brower-window height
//     myCanvas.width = innerHeight-20;
//     myCanvas.height = innerHeight-20;
//   }
//   else {  // fit canvas to browser-window width
//     // myCanvas.width = innerWidth/2-20;
//     // myCanvas.height = 0.5*innerWidth-20;
//     myCanvas.width = innerWidth-20;
//     myCanvas.height = innerWidth-20;
//   }
// }
