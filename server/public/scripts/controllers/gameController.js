app.controller('GameController', ['$scope', '$http', 'DataFactory', function($scope, $http, DataFactory) {
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
  $scope.emotion = "sweating";
  $scope.dataFactory = DataFactory;
  if($scope.dataFactory.returnCharacters() === undefined) {
    $scope.dataFactory.getCharacters().then(function() {
      $scope.currChar = $scope.dataFactory.getCharacter('witnessOne');
      console.log($scope.currChar);


    });
  } else {
    $scope.characters = $scope.dataFactory.getCharacters();
  }
}]);
