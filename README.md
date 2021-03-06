# gravity-angular-velocity
Gravity 2D model with Velocity &amp; Angular

## Documentation

+ Check [Velocity.js](http://julian.com/research/velocity/).
+ Check [AngularJS](https://angularjs.org/).
+ [More velocity demos](http://davidwalsh.name/jack-rugiles-favorite-codepen-demos).

## Example

```html
<html>
<head>
  <title>Gravity 2D model with Velocity & Angular</title>

  <link rel="stylesheet" type="text/css" href="css/gravity.css"/>
</head>
<body ng-app="gravity">
  <div id="gravity" data-ng-controller="GravityController as gc">
      <p>Double-click to add new nodes. Drag to move them. <br>Change skin: <a data-ng-click="gc.previousSkin()" href="">Previous</a> / <a data-ng-click="gc.nextSkin()" href="">Next</a>.</p>
      <gravity></gravity>
  </div>

  <script type="text/javascript" src="../bower_components/angular/angular.min.js"></script>
  <script type="text/javascript" src="../bower_components/velocity/velocity.min.js"></script>

  <!-- Gravity dependencies -->
  <script type="text/javascript" src="../dist/gravity.min.js"></script>

</body>
</html>
```
