let margin = 45;
let speed = 0.05; //0.1
let passSlowness = 8; //10
let pattern;

var control = 0;
var centralPointX, centralPointY;
var frameCount = 0;

let log = [false, false, false, false, false, false, false, false, false]; // length = 9;
// for testing
// let log = [true, true, true, true, true, true, true, true, true];
let bg;
var bgStarted;
var randomer;
let amplitude;

var modelReady = false;

let video;
let poseNet;
let poses = [];

function preload() {
  bg = loadSound('starry_sea.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  ellipseMode(RADIUS);
  background(0);
  pattern = new Pattern(windowWidth,  windowHeight, margin, passSlowness);

  stroke(255);

  // indicator for background music, only triggers once;
  bgStarted = false;
  amplitude = new p5.Amplitude();

  // // later need to use btn to control
  // pattern.finish = false;

  // find midpoint
  centralPointX = Math.floor(pattern.field.length / 2);
  centralPointY = Math.floor(pattern.field[0].length / 2);

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@
  // PoseNet
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, ready);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@
}

function draw() {
  if (modelReady) {
    if (bgStarted) {
      let level = amplitude.getLevel();
      let col = map(level,0,1,0,150);
      background(col);
    } else {
      background(0);
    }
    if (log.includes(false)) {
      poseProcess();
    } else {
      // random loop
      if (pattern.finish) {
        // all have been played once
          if (!bgStarted) {
            bgStarted = true // triggers only once;
            bg.loop();
          }
        randomer = random([-1,1]);
        control += randomer;
        if (control > 4) {
          control = -4;
        } else if (control < -4) {
          control = 4;
        }

        // find random point
        centralPointX = Math.floor(random(pattern.field.length));
        centralPointY = Math.floor(random(pattern.field[0].length));
        pattern.finish = false;
        pattern.updateRange = 0;
        pattern.updateSet = new Set();
        console.log("now Loop");
        console.log(control);
      }
    }
    if (control == -4) {
      pattern.update(centralPointX, centralPointY, "-4");
      pattern.display(n="inf");
    }
    if (control == -3) {
      pattern.update(centralPointX, centralPointY, "-3");
      pattern.display(n="inf");
    }
    if (control == -2) {
      pattern.update(centralPointX, centralPointY, "-2");
      pattern.display(n="inf");
    }
    if (control == -1) {
      pattern.update(centralPointX, centralPointY, "-1");
      pattern.display(n=8);
    }
    if (control == 0) {
      pattern.update(centralPointX, centralPointY, "0");
      pattern.display(n=8);
    }
    if (control == 1) {
      pattern.update(centralPointX, centralPointY, "1");
      pattern.display(n=6);
    }
    if (control == 2) {
      pattern.update(centralPointX, centralPointY, "2");
      pattern.display(n=6);
    }
    if (control == 3) {
      pattern.update(centralPointX, centralPointY, "3");
      pattern.display(n=6);
    }
    if (control == 4) {
      pattern.update(centralPointX, centralPointY, "4");
      pattern.display(n=8);
    }

    // if (pattern.finish) {
    //   control = 2;
    //   pattern.finish = false;
    //   pattern.updateRange = 0;
    //   pattern.updateSet = new Set();
    // }
    // if (control == 2) {
    //   pattern.update(centralPointX, centralPointY, "1");
    //   pattern.display(n="6");
    // }
  }
}

function ready() {
  console.log("model ready");
  modelReady = true;
}

function poseProcess() {
  frameCount++;
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    if (pose.leftShoulder.confidence > 0.2 &&
        pose.rightShoulder.confidence > 0.2 &&
        pose.leftElbow.confidence > 0.2 &&
        pose.rightElbow.confidence > 0.2) {
      let leftShoulder = pose.leftShoulder;
      let rightShoulder = pose.rightShoulder;
      let leftElbow = pose.leftElbow;
      let rightElbow = pose.rightElbow;
      let leftWrist = pose.leftWrist;
      let rightWrist = pose.rightWrist;

      let shoulderMidPointX = (leftShoulder.y + rightShoulder.y) / 2;
      let shoulderMidPointY = (leftShoulder.x + rightShoulder.x) / 2;
      if (shoulderMidPointX < 0) {
        shoulderMidPointX = 0;
      } else if (shoulderMidPointX > height-1) {
        shoulderMidPointX = height-1;
      }
      if (shoulderMidPointY < 0) {
        shoulderMidPointY = 0;
      } else if (shoulderMidPointY > width-1) {
        shoulderMidPointY = width-1;
      }
      // calculate the center point with midpoint of shoulders
      let unitHeight = height / pattern.field.length;
      let unitWidth = width / pattern.field[0].length;
      centralPointX = Math.floor(shoulderMidPointX / unitHeight);
      centralPointY = Math.floor((width - shoulderMidPointY) / unitWidth);
      // console.log(leftWrist.y, shoulderMidPointY, rightWrist.y);
      // detect pose for control
      if (pattern.finish) {
        if (leftWrist.y < rightWrist.y && leftWrist.y < shoulderMidPointY) { // -1
          console.log("left");
          control += 1;
          if (control > 4) {
            control = -4;
          }
          log[control + 4] = true;
          pattern.finish = false;
          pattern.updateRange = 0;
          pattern.updateSet = new Set();
          console.log(control);
        } else if (leftWrist.y > rightWrist.y && rightWrist.y < shoulderMidPointY) { // +1
          console.log("right");
          control -= 1;
          if (control < -4) {
            control = 4;
          }
          log[control + 4] = true;
          pattern.finish = false;
          pattern.updateRange = 0;
          pattern.updateSet = new Set();
          console.log(control);
        }
      }
    }


  }
}

function mouseClicked() {
  if (mouseButton === LEFT) { // directly enter automatic mode
    log = [true, true, true, true, true, true, true, true, true]; // length = 9;
  }
}
