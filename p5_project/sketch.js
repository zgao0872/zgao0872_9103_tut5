let patterns = [];
const padding = 20;


class CircularPattern {
  constructor(x, y, colors) {
    this.x = x;
    this.y = y;
    this.radius = 70;
    this.colors = colors;
    this.dotSize = 5;
    this.ringSpacing = 7;
   
  }

  drawInternalPattern() {
   
    fill(this.colors.internalBbColor);
    circle(0, 0, this.dotSize * 10);

    switch(this.colors.internalPatternStyle) {
      case "concentric circles":
        let circleColorsPalette = {
          "green": {
            outerCircleColor: "#e4462b",
            innerCircleColor: "#d443a5",
          },
          "purple": {
            outerCircleColor: "#e4462b",
            innerCircleColor: "#305b53",
          },
          "cyan": {
            outerCircleColor: "#c74cab",
            innerCircleColor: "#1b9692",
          }
        };
        
        let selectedPalette = circleColorsPalette[this.colors.type] || circleColorsPalette["green"];
        
        for (let r = this.dotSize * 10; r > 0; r -= 10) {
          let color = (r / 10) % 2 === 0 ? selectedPalette.outerCircleColor : selectedPalette.innerCircleColor;
          fill(color);
          circle(0, 0, r);
        }
        break;
      
      case "zigzag lines":
        stroke(255, 255, 255, 200);
        strokeWeight(1);
        noFill();
        
        let zigzagLayers = 3;
        let baseRadius = 2;
        
        for (let layer = 0; layer < zigzagLayers; layer++) {
          let segments = 12 + layer * 2;
          let radius = baseRadius + layer * this.dotSize * 2;
          
          beginShape();
          for (let i = 0; i < segments; i++) {
            let angle = (TWO_PI * i) / segments;
            let x = cos(angle) * (radius + (i % 2 ? -4 : 4));
            let y = sin(angle) * (radius + (i % 2 ? -4 : 4));
            vertex(x, y);
          }
          endShape(CLOSE);
        }
        
        noStroke();
        break;

      case "beads":
        fill(255, 255, 255);
        let beadLayers = 2;
        
        for (let layer = 1; layer <= beadLayers; layer++) {
          let beadCount = 8 * layer;
          let beadRadius = this.dotSize * 2 * layer;
          
          for (let i = 0; i < beadCount; i++) {
            let angle = (TWO_PI * i) / beadCount;
            let x = cos(angle) * beadRadius;
            let y = sin(angle) * beadRadius;
            circle(x, y, this.dotSize);
          }
        }
        break;
      
      default:
        fill(255, 255, 255, 150);
        circle(0, 0, this.dotSize * 6);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
  

    noStroke();
    fill(this.colors.bgColors);
    circle(0, 0, this.radius * 2);

   

    for (let r = this.radius-5; r > 0; r -= this.ringSpacing) {
      const circumference = TWO_PI * r;
      const dots = floor(circumference / (this.dotSize * 2));
      const angleStep = TWO_PI / dots;
      
      fill(this.colors.patternColors);

      for (let angle = 0; angle < TWO_PI; angle += angleStep) {
        const x = r * cos(angle);
        const y = r * sin(angle);
        circle(x, y, this.dotSize);
      }
    }

    this.drawInternalPattern();
    pop();
  }

  overlaps(other) {
    const minDistance = this.radius * 2 + 10;
    const distance = dist(this.x, this.y, other.x, other.y);
    return distance < minDistance;
  }
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  
  const arrayOfColors = [
    {
      type:"green",
      bgColors: "#cdf5e1",
      patternColors: "#2ba441",
      internalBbColor: "#fb586a",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"red",
      bgColors: "#fef3f3",
      patternColors: "#d03c49",
      internalBbColor: "#fa6776",
      internalPatternStyle:"zigzag lines"
    },
    {
      type:"orange",
      bgColors: "#f7edd9",
      patternColors: "#fc8c27",
      internalBbColor: "#bac37e",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"blue-yellow",
      bgColors: "#f4b628",
      patternColors: "#115799",
      internalBbColor: "#d5499b",
      internalPatternStyle:"beads"
    },
    {
      type:"cyan",
      bgColors: "#b6eff1",
      patternColors: "#119995",
      internalBbColor: "#ca3daf",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"purple",
      bgColors: "#cfe3f5",
      patternColors: "#231c80",
      internalBbColor: "#b03f8e",
      internalPatternStyle:"concentric circles"
    },
    {
      type:"",
      bgColors: "#fdc038",
      patternColors: "#d5236f",
      internalBbColor: "#f165cc",
      internalPatternStyle:"concentric circles"
    }
  ];

  let gridSize = 150;
  for (let x = gridSize/2; x < width - gridSize/2; x += gridSize) {
    for (let y = gridSize/2; y < height - gridSize/2; y += gridSize) {
      let posX = x; 
      let posY = y; 
      const choosenPallete = random(arrayOfColors);
      const pattern = new CircularPattern(posX, posY, choosenPallete)

      let overlapping = false;
      for (let other of patterns) {
        if (pattern.overlaps(other)) {
          overlapping = true;
          break;
        }
      }
      
      if (!overlapping) {
        patterns.push(pattern);
      }
    }
  }

 
  
}

function draw() {
  background('#086487');
  
  patterns.forEach(pattern => {
    pattern.display();
  });
  
 
  
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patterns = [];
  setup();
}