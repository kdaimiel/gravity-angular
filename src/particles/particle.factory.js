angular.module('Gravity.Factories')
  .factory('Particle', Particle);

function Particle(){
  this.size = 0.5+Math.random()*3.5;
  this.position = { x: 0, y: 0 };
  this.shift = { x: 0, y: 0 };
  this.angle = 0;
  this.speed = 0.01 + (this.size/4) * 0.0015;
  this.force = 1 - (Math.random()*0.15);
  this.color = '#ffffff';
  this.orbit = 1;
  this.magnet = null;
}
