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



