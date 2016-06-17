app.controller('TitleController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {
var eggmusic = ngAudio.load('../assets/audio/bgm/egg.mp3');
$scope.background = {
  'background-position': '-2217px -580px'
};
  $scope.clickCase = function(caseNum){
    DataFactory.setCaseNum(caseNum);
    var selectsound = ngAudio.load('../assets/audio/sfx/sfx-selectblip.wav');
    selectsound.play();
  };
$scope.datboi = function(){
  if ($scope.egg === true){
    $scope.egg = false;
    eggmusic.pause();
  } else {
    $scope.egg = true;
    eggmusic.play();
    eggmusic.loop = true;
  }
};
}]);
