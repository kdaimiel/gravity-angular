/*
 * gravity
 * @Description Gravity 2D model with Velocity & Angular
 * @version v1.0.5 - 2015-06-29
 * @link 
 * @author Enrique Daimiel Ruiz <k.daimiel@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
angular.module('Gravity.Constants', []);
angular.module('Gravity.Factories', ['Gravity.Constants']);
angular.module('Gravity.Services', ['Gravity.Factories']);
angular.module('Gravity.Directives', ['Gravity.Services']);
angular.module('Gravity.Controllers', ['Gravity.Services']);

angular.module('gravity', [
    'Gravity.Controllers',
    'Gravity.Directives'
  ]).run([
    '$log',
    function ($log) {
      $log.debug('Gravity run');
    }
  ]);


(function () {
  angular.module('Gravity.Controllers')
    .controller('GravityController', GravityController);

  GravityController.$inject = ['gravityService', '$log'];

  function GravityController(gravityService, $log){

    var vm = this;
    vm.nextSkin = gravityService.nextSkin;
    vm.previousSkin = gravityService.previousSkin;
    $log.info('GravityController invoked');
  }
})();


(function (){
  angular.module('Gravity.Directives')
    .directive('gravity', gravityDirective);

  gravityDirective.$inject = ['$log', 'gravityService'];

  function gravityDirective($log, gravityService) {
    return {
      link: link,
      restrict: 'E',
      template: '<div class="gravity"><canvas></canvas></div>'
    };

    function link (scope, element, attrs) {
      var canvas = element[0].firstChild.firstChild;
      gravityService.init(canvas);
      $log.info('Gravity directive loaded');
    }
  }
})();


(function() {
  'use strict';

  angular.module('Gravity.Services')
    .service('gravityService', gravityService);

  gravityService.$inject = ['$log', 'MAGNETS_AT_START', 'PARTICLES_PER_MAGNET', 'MAGNETIC_FORCE_THRESHOLD', 'SCREEN'];

  function gravityService($log, MAGNETS_AT_START, PARTICLES_PER_MAGNET, MAGNETIC_FORCE_THRESHOLD, SCREEN) {

    var canvas;
    var context;
    var particles = [];
    var magnets = [];
    
    var mouseX;
    var mouseY;
    var mouseIsDown = false;
    var mouseDownTime = 0;
    
    var skinIndex = 0;
    var skins = [
      { glowA: 'rgba(0,200,250,0.3)', glowB: 'rgba(0,200,250,0.0)', particleFill: '#ffffff', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
      { glowA: 'rgba(230,0,0,0.3)', glowB: 'rgba(230,0,0,0.0)', particleFill: '#ffffff', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
      { glowA: 'rgba(0,230,0,0.3)', glowB: 'rgba(0,230,0,0.0)', particleFill: 'rgba(0,230,0,0.7)', fadeFill: 'rgba(22,22,22,.6)', useFade: true },
      { glowA: 'rgba(0,0,0,0.3)', glowB: 'rgba(0,0,0,0.0)', particleFill: '#333333', fadeFill: 'rgba(255,255,255,.6)', useFade: true },
      { glowA: 'rgba(0,0,0,0.0)', glowB: 'rgba(0,0,0,0.0)', particleFill: '#333333', fadeFill: 'rgba(255,255,255,.2)', useFade: true },
      { glowA: 'rgba(230,230,230,0)', glowB: 'rgba(230,230,230,0.0)', particleFill: '#ffffff', fadeFill: '', useFade: false }
    ];

    var service = {
      init : init,
      nextSkin: nextSkin,
      previousSkin: previousSkin,
      log: $log.log
    };

    return service;

    function createMagnets() {
      for (var i = 0; i < MAGNETS_AT_START; i++) {
        var position = {
          x: (Math.random() * canvas.clientWidth),
          y: (Math.random() * canvas.clientHeight)
        };
        
        createMagnet( position );
      }
    }

    function createMagnet( position ) {
      var m = new Magnet();
      m.position.x = position.x;
      m.position.y = position.y;
      
      magnets.push( m );
      
      createParticles( m.position );
      $log.info('Magnet created');
    }

    function createParticles( position ) {
      for (var i = 0; i < PARTICLES_PER_MAGNET; i++) {
        var p = new Particle();
        p.position.x = position.x;
        p.position.y = position.y;
        p.shift.x = position.x;
        p.shift.y = position.y;
        p.color = skins[skinIndex].particleFill;
        
        particles.push( p );
      }
    }

    function distanceBetween(p1,p2) {
      var dx = p2.x-p1.x;
      var dy = p2.y-p1.y;
      return Math.sqrt(dx*dx + dy*dy);
    }

    function documentMouseDownHandler(event) {
      event.preventDefault();
      
      mouseIsDown = true;
      
      if( new Date().getTime() - mouseDownTime < 300 ) {
        // The mouse was pressed down twice with a < 300 ms interval: add a magnet
        createMagnet( { x: mouseX, y: mouseY } );
        
        mouseDownTime = 0;
      }
      
      mouseDownTime = new Date().getTime();
      
      for( var i = 0, len = magnets.length; i < len; i++ ) {
        var magnet = magnets[i];
        
        if( distanceBetween( magnet.position, { x: mouseX, y: mouseY } ) < magnet.orbit * 0.5) {
          magnet.dragging = true;
          break;
        }
      }
    }

    function documentMouseMoveHandler(event) {
      mouseX = event.clientX - canvas.offsetLeft + window.pageXOffset;
      mouseY = event.clientY - canvas.offsetTop + window.pageYOffset ;
    }
    
    function documentMouseUpHandler(event) {
      mouseIsDown = false;
      
      for( var i = 0, len = magnets.length; i < len; i++ ) {
        var magnet = magnets[i];
        magnet.dragging = false;
      }
    }

    function init(element) {

      canvas = element;

      if (canvas && canvas.getContext) {
        context = canvas.getContext('2d');

        // Register event listeners
        canvas.addEventListener('mousemove', documentMouseMoveHandler, false);
        canvas.addEventListener('mousedown', documentMouseDownHandler, false);
        canvas.addEventListener('mouseup', documentMouseUpHandler, false);
        canvas.addEventListener('resize', windowResizeHandler, false);
        
        windowResizeHandler();
        
        createMagnets();
        
        setInterval( loop, 1000 / 60 );

        $log.info('Gravity model initialized');

      }
    }

    function loop() {
      
      if( skins[skinIndex].useFade) {
        context.fillStyle = skins[skinIndex].fadeFill;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      }
      else {
        context.clearRect(0,0,canvas.width,canvas.height);
      }
      
      var particle, magnet;
      var i, j, ilen, jlen;
      
      // Render the magnets
      for( j = 0, jlen = magnets.length; j < jlen; j++ ) {
        magnet = magnets[j];
        
        if( magnet.dragging ) {
          magnet.position.x += ( mouseX - magnet.position.x ) * 0.2;
          magnet.position.y += ( mouseY - magnet.position.y ) * 0.2;
        }
        
        // Increase the size of the magnet center point depending on # of connections
        magnet.size += ( (magnet.connections/3) - magnet.size ) * 0.025;
        magnet.size = Math.max(magnet.size,2);
        
        var gradientFill = context.createRadialGradient(magnet.position.x,magnet.position.y,0,magnet.position.x,magnet.position.y,magnet.size*10);
        gradientFill.addColorStop(0,skins[skinIndex].glowA);
        gradientFill.addColorStop(1,skins[skinIndex].glowB);
        
        context.beginPath();
        context.fillStyle = gradientFill;
        context.arc(magnet.position.x, magnet.position.y, magnet.size*10, 0, Math.PI*2, true);
        context.fill();
        
        context.beginPath();
        context.fillStyle = '#00000000';
        context.arc(magnet.position.x, magnet.position.y, magnet.size, 0, Math.PI*2, true);
        context.fill();
        
        magnet.connections = 0;
      }
      
      // Render the particles
      for (i = 0, ilen = particles.length; i < ilen; i++) {
        particle = particles[i];
        
        var currentDistance = -1;
        var closestDistance = -1;
        var closestMagnet = null;
        
        var force = { x: 0, y: 0 };
        
        // For each particle, we check what the closes magnet is
        for( j = 0, jlen = magnets.length; j < jlen; j++ ) {
          magnet = magnets[j];
          
          currentDistance = distanceBetween( particle.position, magnet.position ) - ( magnet.orbit * 0.5 );
          
          if( particle.magnet !== magnet ) {
            var fx = magnet.position.x - particle.position.x;
            if( fx > -MAGNETIC_FORCE_THRESHOLD && fx < MAGNETIC_FORCE_THRESHOLD ) {
              force.x += fx / MAGNETIC_FORCE_THRESHOLD;
            }
            
            var fy = magnet.position.y - particle.position.y;
            if( fy > -MAGNETIC_FORCE_THRESHOLD && fy < MAGNETIC_FORCE_THRESHOLD ) {
              force.y += fy / MAGNETIC_FORCE_THRESHOLD;
            }
            
          }
            
          if( closestMagnet === null || currentDistance < closestDistance ) {
            closestDistance = currentDistance;
            closestMagnet = magnet;
          }
        }
        
        if( particle.magnet === null || particle.magnet !== closestMagnet ) {
          particle.magnet = closestMagnet;
        }
        
        closestMagnet.connections += 1;
        
        // Rotation
        particle.angle += particle.speed;
        
        // Translate towards the magnet position
        particle.shift.x += ( (closestMagnet.position.x+(force.x*8)) - particle.shift.x) * particle.speed;
        particle.shift.y += ( (closestMagnet.position.y+(force.y*8)) - particle.shift.y) * particle.speed;
        
        // Appy the combined position including shift, angle and orbit
        particle.position.x = particle.shift.x + Math.cos(i+particle.angle) * (particle.orbit*particle.force);
        particle.position.y = particle.shift.y + Math.sin(i+particle.angle) * (particle.orbit*particle.force);
        
        // Limit to screen bounds
        particle.position.x = Math.max( Math.min( particle.position.x, canvas.clientWidth-particle.size/2 ), particle.size/2 );
        particle.position.y = Math.max( Math.min( particle.position.y, canvas.clientHeight-particle.size/2 ), particle.size/2 );
        
        // Slowly inherit the cloest magnets orbit
        particle.orbit += ( closestMagnet.orbit - particle.orbit ) * 0.1;
        
        context.beginPath();
        context.fillStyle = particle.color;
        context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
        context.fill();
      }
    }
          
    function nextSkin() {
      event.preventDefault();
      ++skinIndex;
      updateSkin();
    }

    function previousSkin() {
      event.preventDefault();
      --skinIndex;
      updateSkin();
    }

    function updateSkin() {
      skinIndex = skinIndex < 0 ? skins.length-1 : skinIndex;
      skinIndex = skinIndex > skins.length-1 ? 0 : skinIndex;

      for (var i = 0, len = particles.length; i < len; i++) {
        particles[i].color = skins[skinIndex].particleFill;
      }

      $log.info('Skin updated');
    }

    function windowResizeHandler() {

      canvas.width = document.getElementById('gravity') ? document.getElementById('gravity').clientWidth : SCREEN.WIDTH;
      canvas.height = document.getElementById('gravity') ? document.getElementById('gravity').clientHeight : SCREEN.HEIGHT;

      mouseX = canvas.clientWidth - canvas.offsetLeft;
      mouseY = canvas.clientHeight - canvas.offsetTop;

      $log.info('Windows resized invoked');
    }
  }

})();

(function (){
  'use strict';

  angular.module('Gravity.Constants')
    .constant('MAGNETS_AT_START', 4) // Number of magnets after initiation
    .constant('MAGNETIC_FORCE_THRESHOLD', 300) // Attraction force threshold of magnet 
    .constant('PARTICLES_PER_MAGNET', 20) // Number of particles per magnet

    .constant('SCREEN', { // Screen size only used when a gravity id is not defined
      HEIGHT: 400,
      WIDTH: 400,
    });

})();
angular.module('Gravity.Factories')
  .factory('Particle', Particle);

function Particle(){
  this.size = 0.5+Math.random()*3.5;
  this.position = { x: 0, y: 0 };
  this.shift = { x: 0, y: 0 };
  this.angle = 0;
  this.speed = 0.01 + (this.size/4) * 0.015;
  this.force = 1 - (Math.random()*0.15);
  this.color = '#ffffff';
  this.orbit = 1;
  this.magnet = null;
}
function Magnet(){
  this.orbit = 100;
  this.position = { x: 0, y: 0 };
  this.dragging = false;
  this.connections = 0;
  this.size = 1;
}

angular.module('Gravity.Factories')
  .factory('Magnet', Magnet);
