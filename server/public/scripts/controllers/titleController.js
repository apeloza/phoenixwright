app.controller('TitleController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {

//Prepares easter egg music
var eggmusic = ngAudio.load('../assets/audio/bgm/egg.mp3');

//Sets background with ng-style
$scope.background = {
  'background-position': '-2217px -580px'
};

//Sets case# and then the anchor directs us to case.html/gamecontroller
  $scope.clickCase = function(caseNum){
    eggmusic.stop();
    DataFactory.setCaseNum(caseNum);
    var selectsound = ngAudio.load('../assets/audio/sfx/sfx-selectblip.wav');
    selectsound.play();
  };

  //Easter egg activates
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
