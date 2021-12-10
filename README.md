# Geo Wave
## Decoding Nature Final Project
Created By William Zhang [cz1627@nyu.edu](cz1627@nyu.edu)

### Project Link: https://mstxy.github.io/Geo-Wave/

### Abstract 
This project uses p5.js and PoseNet in ml5.js to created an interactive geometric pattern that can be controlled through user movement. Through the interaction between basic geometries and human, this project aims to imitate how people tries to figure out the myth of nature and exploring the possibilities of the geometries to decode the nature. 

### Mechanisms
The original pattern is a hexagonal tile with white hexagon on black background. 
![pattern_0](doc/pattern_0.png)
The mechanisms are as such: raising the left wrist will result in the hexagonal pattern changes in one direction and raising the right wrist will result in the hexagonal pattern changes in the opposite direction. The pattern will only change while the current changing pattern has stabilized. The pattern are changed through hexagonal spreading, from the center point calculated from the middle point of the two shoulders of the user. The available patterns are circulatory, meaning that if the user keeps raising the left hand, the pattern will change back to the original pattern in the opposite order as to if the user keeps raising the right hand. If all the available patterns have been explored, then the background lo-fi music will be triggerred, and the patterns will now change automatically from a randomly calculated center point, and the order of pattern change will be controlled by a randomizer. Moreover, when the music starts playing, the background will have pulses corresponding to the amplitude of the background music.

### Inspiration
The overall inspiration is from the fact that p5.js has a complete geometry system, and everything we create using p5.js, no matter how complicated, are sort of based on these basic geometries. Similar to that, our nature, seems to also consist of basic geometries, where all complex things in the nature are no more than simple rules and simple geometries. This idea comes from the Fractal and Cellular Automata chapters of this course. In fractals, given a basic shape and a basic rule, a very complex shape could be created. For example, given one line with a length and a rule of splitting the line in two on one end within a range of angle and make some variation in the line length, a very life-like tree could be generated. In cellular automata, this idea goes even more extreme. By randomly exploring combinations of binary digits, discoveries that resembles real life problems and natural rules could be found. So the nature really is something intrinsitically simple but appears diversified and complicated. Therefore, through using poses to control the geometry pattern in this project, it is kind of like how ancient people tried to play around and experiment with the basic geometries and tring to get somethign extraodiary out of it.

### Tools & Design
First Sketch: 
![first_sketch](doc/draft.png)


### Design



