let canvas
const slider = {}
const checkbox = {}

const show = {
  points: true,
  circles: false,
  small: false,
  large: false,
  star: false
}

let theta = 0

function setup() {
  //create canvas
  canvas = createCanvas(620, 420)
  canvas.parent("game")

  //create sliders
  slider.star = createSlider(5, 20, 7, 1)
  slider.polygon = createSlider(2, 9, 3, 1)
  slider.distance = createSlider(0, 1, 0.8, 0)
  
  //create checkboxes
  checkbox.points = createCheckbox("", show.points)
  checkbox.circles = createCheckbox("", show.circles)
  checkbox.small = createCheckbox("", show.small)
  checkbox.large = createCheckbox("", show.large)
  checkbox.star = createCheckbox("", show.star)
 
  //listen for check events
  checkbox.points.changed(() => show.points = !show.points)
  checkbox.circles.changed(() => show.circles = !show.circles)
  checkbox.small.changed(() => show.small = !show.small)
  checkbox.large.changed(() => show.large = !show.large)
  checkbox.star.changed(() => show.star = !show.star)
  
  //canvas coordinates
  const x = canvas.elt.offsetLeft + 440
  const y = canvas.elt.offsetTop
  
  //position sliders
  slider.star.position(x - 5, y + 45)
  slider.polygon.position(x - 5, y + 95)
  slider.distance.position(x - 5, y + 145)
  
  //position checkboxes
  checkbox.points.position(x, y + 190)
  checkbox.circles.position(x, y + 220)
  checkbox.small.position(x, y + 250)
  checkbox.large.position(x, y + 280)
  checkbox.star.position(x, y + 310)
}

function draw() {
  background(255)
  theta += 0.025

  //colors
  const BLACK = color(0, 0, 0)
  const RED = color(255, 0, 0)
  const GREEN = color(0, 255, 0)
  const BLUE = color(0, 0, 255)
  
  //slider values
  const STAR = slider.star.value()
  const POLY = slider.polygon.value()
  const DIST = slider.distance.value()
  
  //functions for getting coordinates
  const c = coordinate(STAR, POLY, DIST)
  
  //label sliders
  textSize(14)
  styleFill(BLACK)
  text("star vertices: " + STAR, 435, 35)
  text("polygon vertices: " + POLY, 435, 85)
  text("distance from center: " + round(DIST, 3), 435, 135)
  
  //label checkboxes
  textSize(14)
  styleFill(BLACK)
  text("show points", 460, 205)
  text("show circles", 460, 235)
  text("show small polygons", 460, 265)
  text("show large polygons", 460, 295)
  text("show star", 460, 325)
  
  //transform coordinates
  translate(210, 210)
  scale(200, -200)
  
  //draw large circle
  styleStroke(BLACK)
  circle(0, 0, 2)
  
  //draw small circles
  if(show.circles) {
    for(let i = 0; i < STAR - POLY; i++) {
      styleStroke(BLACK)
      circle(c.circleX(i), c.circleY(i), 2 * POLY/STAR)
    }
  }
  
  //draw points
  if(show.points) {
    for(let i = 0; i < STAR - POLY; i++) {
      styleFill(BLACK)
      for(let j = 0; j < POLY; j++) {
        circle(c.pointX(i, j), c.pointY(i, j), 0.05)
      }
    }
  }
  
  //draw small polygons
  if(show.small) {
    for(let i = 0; i < STAR - POLY; i++) {
      styleStroke(RED)
      beginShape()
      for(let j = 0; j < POLY; j++) {
        vertex(c.pointX(i, j), c.pointY(i, j))
      }
      endShape(CLOSE)
    }
  }
  
  //draw large polygons
  if(show.large) {
    for(let j = 0; j < POLY; j++) {
      styleStroke(BLUE)
      beginShape()
      for(let i = 0; i < STAR - POLY; i++) {
        vertex(c.pointX(i, j), c.pointY(i, j))
      }
      endShape(CLOSE)
    }
  }
  
  //draw star
  if(show.star) {
    styleStroke(GREEN)
    beginShape()
    for(let i = 0; i < STAR; i++) {
      const angle = TAU * POLY/STAR * i
      vertex(cos(angle), sin(angle))
    }
    endShape(CLOSE)
  }
}

function coordinate(STAR, POLY, DIST) {
  //coordinates of small circle
  const circleDist = 1 - POLY/STAR
  const circleAngle = i => TAU/(STAR - POLY) * i + theta
  const circleX = i => cos(circleAngle(i)) * circleDist
  const circleY = i => sin(circleAngle(i)) * circleDist
  
  //coordinates of point
  const pointDist = POLY/STAR * DIST
  const pointAngle = j => TAU/POLY * j - theta * (STAR - POLY)/POLY
  const pointX = (i, j) => circleX(i) + cos(pointAngle(j)) * pointDist
  const pointY = (i, j) => circleY(i) + sin(pointAngle(j)) * pointDist
  
  return { circleX, circleY, pointX, pointY }
}

//set stroke color
function styleStroke(color) {
  strokeWeight(0.01)
  stroke(color)
  noFill()
}

//set fill color
function styleFill(color) {
  fill(color)
  noStroke()
}