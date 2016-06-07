app.controller('GameController', ['$scope', '$http', 'DataFactory', function($scope, $http, DataFactory) {

$scope.advanceText = function() {
var currIndex = $scope.lines.indexOf($scope.line);
var nextIndex = currIndex + 1;
$scope.line = $scope.lines[nextIndex];
if($scope.line.character){
  $scope.currChar = DataFactory.getCharacter($scope.line.character);
}
if($scope.line.emotion){
  $scope.emotion = $scope.line.emotion;
}
};
    DataFactory.initialize().then(function(){
      $scope.currChar = DataFactory.getCharacter('detective');
      $scope.currScene = DataFactory.getScene('opening');
      $scope.emotion = "default";
      $scope.lines = $scope.currScene.lines;
      $scope.line = $scope.lines[0];
    });

}]);
