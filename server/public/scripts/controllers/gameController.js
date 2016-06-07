app.controller('GameController', ['$scope', '$http', 'DataFactory', function($scope, $http, DataFactory) {

    DataFactory.initialize().then(function(){
      $scope.currChar = DataFactory.getCharacter('witnessOne');
      $scope.currScene = DataFactory.getScene('opening');
      $scope.emotion = "sweating";

    });

}]);
