app.controller('GameController', ['$scope', '$http', '$timeout', 'DataFactory', function($scope, $http, $timeout, DataFactory) {

    $scope.advanceText = function() {
        var currIndex = $scope.lines.indexOf($scope.line) || 0;
        var nextIndex = currIndex + 1;
        $scope.line = $scope.lines[nextIndex];
        if ($scope.line.character) {
            $scope.currChar = DataFactory.getCharacter($scope.line.character);
        }
        if ($scope.line.emotion) {
            $scope.emotion = $scope.line.emotion;
        }
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.typeText();
    };
    $scope.typeText = function() {
        if ($scope.displayLine.length < $scope.line.line.length) {
            var index = $scope.displayLine.length;
            $scope.displayLine += $scope.line.line[index];
            $timeout($scope.typeText, 40);
        } else {
            $scope.talking = false;
        }
    };
    DataFactory.initialize().then(function() {
        $scope.currChar = DataFactory.getCharacter('detective');
        $scope.currScene = DataFactory.getScene('opening');
        $scope.emotion = "default";
        $scope.lines = $scope.currScene.lines;
        $scope.advanceText();
    });

}]);
