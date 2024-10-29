let patterns = [];
let beads = [];
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

    rotate(this.rotation);

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

class DecorativeBead {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 13.5; 
    this.glowSize = this.size * 1.5;
    this.innerSize = this.size * 0.4;
  }

  display() {
    push();
    translate(this.x, this.y);
    
    noStroke();
    let glowColor = color('#f47b23');
    
    fill(glowColor);
    circle(0, 0, this.glowSize);
    
    fill('black');
    circle(0, 0, this.size);
    
    fill("white");
    circle(0, 0, this.innerSize);
    
    pop();
  }
}

function drawCurvyConnections() {
  let connectionCounts = new Array(beads.length).fill(0);
  let connections = [];

  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] === 0) {
      let closestDist = Infinity;
      let closestIndex = -1;
      
      for (let j = 0; j < beads.length; j++) {
        if (i !== j && connectionCounts[j] < 3) {
          let d = dist(beads[i].x, beads[i].y, beads[j].x, beads[j].y);
          if (d < closestDist && d < 120) {
            closestDist = d;
            closestIndex = j;
          }
        }
      }
      
      if (closestIndex !== -1) {
        connections.push({
          bead1: i,
          bead2: closestIndex,
          distance: closestDist
        });
        connectionCounts[i]++;
        connectionCounts[closestIndex]++;
      }
    }
  }

  for (let i = 0; i < beads.length; i++) {
    if (connectionCounts[i] >= 3) continue;

    let possibleConnections = [];
    for (let j = 0; j < beads.length; j++) {
      if (i !== j && connectionCounts[j] < 3) {
        let d = dist(beads[i].x, beads[i].y, beads[j].x, beads[j].y);
        if (d < 100) {
          let exists = connections.some(c => 
            (c.bead1 === i && c.bead2 === j) || 
            (c.bead1 === j && c.bead2 === i)
          );
          
          if (!exists) {
            possibleConnections.push({
              bead1: i,
              bead2: j,
              distance: d
            });
          }
        }
      }
    }

    possibleConnections.sort((a, b) => a.distance - b.distance);
    for (let conn of possibleConnections) {
      if (connectionCounts[i] < 3 && connectionCounts[conn.bead2] < 3) {
        connections.push(conn);
        connectionCounts[i]++;
        connectionCounts[conn.bead2]++;
      }
    }
  }

  for (let conn of connections) {
    let bead1 = beads[conn.bead1];
    let bead2 = beads[conn.bead2];
    
    for (let k = 3; k >= 0; k--) {
      stroke(244, 123, 35, map(k, 0, 3, 50, 200));
      strokeWeight(map(k, 0, 3, 3, 0.8));
      
      let midX = (bead1.x + bead2.x) / 2;
      let midY = (bead1.y + bead2.y) / 2;
      
    
      let offsetX = 0;
      let offsetY = 0;
      
      beginShape();
      curveVertex(bead1.x, bead1.y);
      curveVertex(bead1.x, bead1.y);
      curveVertex(midX + offsetX, midY + offsetY);
      curveVertex(bead2.x, bead2.y);
      curveVertex(bead2.x, bead2.y);
      endShape();
    }
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

  let beadSpacing = 40;
  for (let x = beadSpacing; x < width - beadSpacing; x += beadSpacing) {
    for (let y = beadSpacing; y < height - beadSpacing; y += beadSpacing) {
      let validPosition = true;
      
      for (let pattern of patterns) {
        let d = dist(x, y, pattern.x, pattern.y);
        if (d < pattern.radius + 20) {
          validPosition = false;
          break;
        }
      }
      
      if (validPosition) {
        beads.push(new DecorativeBead(x, y));
      }
    }
  }
}

function draw() {
  background('#086487');
  
  patterns.forEach(pattern => {
    pattern.display();
  });
  
  drawCurvyConnections();
  
  beads.forEach(bead => {
    bead.display();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patterns = [];
  beads = [];
  setup();
}