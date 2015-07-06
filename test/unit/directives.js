describe('Unit testing gravity directive', function(){
  var $compile,
      $rootScope;

  // Load the gravity module, which contains the directive
  beforeEach(module('gravity'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('Replaces the element with the appropriate content of gravity directive', function() {
    // Compile a piece of HTML containing the directive
    var element = $compile('<gravity></gravity>')($rootScope);
    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
    // Check that the compiled element contains the templated content
    expect(element.html()).toContain('<div class="gravity"><canvas');
  });
});
