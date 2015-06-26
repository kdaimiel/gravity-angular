
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
