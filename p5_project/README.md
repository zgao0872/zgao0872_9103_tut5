Generative Circular Patterns

This web interaction represents generative artwork as it plays with the theme of circular patterns and beads. Placing animation within the patterns and the beads themselves makes them fascinating and engaging.

How to Interact
1. Load the Page: On page load, the animation starts playing with circular patterns that move with the beads in quite a fidgety fashion.
2. Resize the Window: It will automatically adjust the drawing of the artwork based on a new measurement of the browser window.
Individual Approach to Animation
For my individual contribution, I chose to focus on using Perlin noise to drive the animation of the patterns and beads.

Patterns
The drawing of the individual circular patterns is handled through the CircularPattern class. In order to animate these, I have used Perlin noise for a smooth organic movement:
1. Rotation: Every pattern has a property called currentRotation that increases linearly with time, further modified by the rotationSpeed variable. This gives the impression that the patterns are always rotating and changing.
2. Perlin Noise Animation: I also used some of the Perlin noise for this fluid, animated movement of the patterns. Increment the noise over time and use the values to offset the position of the dots, creating patterns for an interesting, fluid animation.
Beads

The DecorativeBead class draws on the various beads that connect the patterns. For this, in order to animate the beads, I used Perlin noise:
1. Position Animation: The movement of the beads becomes liquid and organic due to the use of Perlin noise that updates the position of each bead.
2. Noise Offset: Just like the patterns, this controls the animation of the beads to animate in such a way that it's in sync with the overall animation via the noiseOffset property.
I used Perlin noise to animate the patterns and beads in such a way that makes the visualization really unique and striking against the other contributions in the group.

Inspiration and References
Sources of inspiration are taken from the creative coding community, which is mainly comprised of both artists and developers interested in the crossover between generative art, patterns, and animation. Key references and inspirations:
•	P5.js examples and tutorials that helped with creating circular patterns, using Perlin noise, and implementing responsive design.
•	Artists whose works have been truly an important source of inspiration: for example, Memo Akten and his amazing generative artworks with and without Perlin noise.
•	"Flow fields" and organic, fluid animation, which have been so fleshed out within the community of creative coding, influence the general aesthetic of this project.

Technical Explanation
It basically revolves around the core classes, including the rendering of patterns and beads in a circular manner through classes like the CircularPattern and the DecorativeBead. 
Different techniques are used in the creation of these intricate patterns by the class of CircularPattern:
The CircularPattern class uses a variety of techniques to create the intricate patterns, including:
•	Concentric circles of different colors
•	Zigzag lines
•	Bead-like elements disposed in concentric circles
These will be animated by updating currentRotation and noiseOffset in the update(), then passing these values into the calculation of position and orientation of the elements that make up the pattern.
Similarly, the DecorativeBead class uses Perlin noise to animate the position of each bead, creating a fluid organic movement that enhances the view of the circular pattern.
The following function, drawCurvyConnections(), draws the curved lines interconnecting these beads. It uses Perlin noise to effectively create a somewhat organic, humanlike feel to the drawing.
Overall, knitting the learning from these skills and the work done on responsive design in the window The resized() function together has made this a generative piece of artwork quite interesting.

Changes to Group Code
Though the core functionality of the group code still remains the same, I have added many important changes and enhancements to enhance animations and interactions:
1. Perlin Noise Animation: I have introduced the use of Perlin noise in view of creating a fluent organic movement of patterns and beads, as described in the "Individual Approach to Animation" section.
2. Responsive Design: The function windowResized() was created to automatically scale and redraw the artwork whenever the browser window is resized.
3. Improved Pattern Placement: This modification in code now happens in setup() to place the patterns in a grid-like fashion, making sure random offsets balance out into an interesting composition visually.

Coupled with the use of Perlin noise, all these changes came into play to produce this generative work of art, which is no doubt completely different from the members of this group.
