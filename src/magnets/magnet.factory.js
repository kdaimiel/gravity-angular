function Magnet(){
  this.orbit = 100;
  this.position = { x: 0, y: 0 };
  this.dragging = false;
  this.connections = 0;
  this.size = 1;
}

angular.module('Gravity.Factories')
  .factory('Magnet', Magnet);
