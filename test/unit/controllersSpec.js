describe('Test unit gravity controllers ', function() {

  beforeEach(module('gravity'));

  var $controller;

  beforeEach(inject(function(_$controller_){
      // The injector unwraps the underscores (_) from around the parameter names when matching
      $controller = _$controller_;

    }
  ));

  it('should have a GravityController with init, nextSkin and previousSkin functions.', function() {
      var controller = $controller('GravityController');
      expect(controller.nextSkin).not.toEqual(undefined);
      expect(controller.previousSkin).not.toEqual(undefined);
    }
  );

});
