
(function (){
  angular.module('Gravity.Directives')
    .directive('gravity', gravityDirective);

  gravityDirective.$inject = ['$log', 'gravityService'];

  function gravityDirective($log, gravityService) {
    return {
      link: link,
      restrict: 'E',
      template: '<div class="gravity"><canvas ></canvas></div>'
    };

    function link (scope, element, attrs) {
      var canvas = element[0].firstChild.firstChild;
      gravityService.init(canvas);

      element.bind('mousedown', function(e){
        gravityService.onMouseDown(e);
      });

      element.bind('mousemove', function(e){
        gravityService.onMouseMove(e);
      });

      element.bind('mouseup', function(e){
        gravityService.onMouseUp(e);
      });

      angular.element(window).bind('resize', function(){
        gravityService.onWindowResize();
      });

      $log.info('Gravity directive loaded');
    }
  }
})();
