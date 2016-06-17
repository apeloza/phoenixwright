app.controller('TitleController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {

$scope.background = {
  'background-position': '-2217px -580px'
};
  $scope.clickCase = function(caseNum){
    DataFactory.setCaseNum(caseNum);
    var selectsound = ngAudio.load('../assets/audio/sfx/sfx-selectblip.wav');
    selectsound.play();
  };

}]);
