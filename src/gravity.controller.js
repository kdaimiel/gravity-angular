
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
