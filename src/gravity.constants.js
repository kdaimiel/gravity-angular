
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