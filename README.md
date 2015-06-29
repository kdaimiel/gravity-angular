# gravity-angular-velocity
Gravity 2D model with Velocity &amp; Angular

## Documentation

+ Check [Velocity.js](http://julian.com/research/velocity/).
+ Check [AngularJS](https://angularjs.org/).
+ [More velocity demos](http://davidwalsh.name/jack-rugiles-favorite-codepen-demos).

## Example

```html
  <div id="gravity" data-ng-controller="GravityController as gc">
      <p>Double-click to add new nodes. Drag to move them. <br>Change skin: <a data-ng-click="gc.previousSkin()" href="">Previous</a> / <a data-ng-click="gc.nextSkin()" href="">Next</a>.</p>
      <gravity></gravity>
  </div>
```
