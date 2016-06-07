app.controller('GameController', ['$scope', '$http', function($scope, $http) {
console.log("Controller running");
$scope.character = {
  "name": "Linter",
  "defaultSound": "blipmale",
  "defaultText": "speech",
  "emotions": {
    "default": {
      "talking":"isaac/isaac_neutral_talking",
      "finished": "isaac/isaac_neutral"
    },
    "mad": {
      "talking":"isaac/isaac_mad_talking",
      "finished": "isaac/isaac_mad"
    }

  }};
  $scope.emotion = "mad";
}]);
