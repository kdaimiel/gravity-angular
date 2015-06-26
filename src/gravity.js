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
