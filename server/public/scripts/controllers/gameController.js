app.controller('GameController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {
    var sceneCounter = 0;
    var blip;
var nextIndex;
var currIndex;
    //This function handles advancing to the next line of text, and swapping variables as needed.
    $scope.advanceText = function() {
        currIndex = $scope.lines.indexOf($scope.line) || 0;
        nextIndex = currIndex + 1;
        checkScene();
        $scope.line = $scope.lines[nextIndex];
        checkCharacter();
        checkBackground();
        checkMusic();
        checkTextType();
        checkNewEvidence();
        checkEvidenceBox();
        if ($scope.line.testimonyStart){
          startTestimony();
        }
        if ($scope.line.examinationStart){
          startExamination();
        }
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';
        checkTalking();
        blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
        debugger;
        checkSFX();
        $scope.typeText();
    };

//This function handles going backwards, and is only functional during testimonies.
$scope.prevText = function(){

  //This if statement makes sure you're not trying to go backwards from the first line.
  if(currIndex === -1){
    return;
  }
  currIndex = $scope.lines.indexOf($scope.line) || 0;
  nextIndex = currIndex - 1;
  checkScene();
  $scope.line = $scope.lines[nextIndex];
  checkCharacter();
  checkBackground();
  checkMusic();
  checkTextType();
  if ($scope.line.testimonyStart){
    startTestimony();
  }
  if ($scope.line.examinationStart){
    startExamination();
  }
  $scope.displayLine = '';
  $scope.talking = true;
  $scope.isTalking = 'talking';

  blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
  $scope.typeText();
};

//Manual over-ride for lines of text that have no one speaking.
function checkTalking(){
  if($scope.line.talking){
    $scope.isTalking = 'finished';
  }
}
//Adds evidence to the court record if the JSON file requests it.
function checkNewEvidence(){
  if($scope.line.show){
     $scope.hiddenEvidence[$scope.line.show]= true;
  }
}

//Checks to see if any SFX or manual over-ride blip noises need to be played.
function checkSFX(){
  if($scope.line.sfx){
    var sfx = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.sfx);
sfx.play();
  }
  debugger;
  if($scope.line.blip){
    blip = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.blip);
  }
}
//Checks to see if the particular line wants to display an evidence box in the top left.
function checkEvidenceBox(){
  if($scope.line.hideBox){
    $scope.evidenceBox = false;

  }
  if($scope.line.showBox){
    $scope.activesrc = $scope.line.showBox;
    $scope.evidenceBox = true;
  }
}
//Governs behaviour regarding what is displayed 'next' in the textbox, should a series of lines end.
function checkScene() {
  if (nextIndex == $scope.lines.length && $scope.isPress === true || nextIndex == $scope.lines.length && $scope.incorrect === true) {
      $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
      $scope.lines = $scope.currScene.lines;
      nextIndex = $scope.pressLoc;
      console.log(nextIndex);
      $scope.isPress = false;
      $scope.isExamination = true;
  } else if (nextIndex == $scope.lines.length && $scope.isExamination === true) {
      nextIndex = 0;
  } else if (nextIndex == $scope.lines.length) {
      sceneCounter++;
      $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
      $scope.lines = $scope.currScene.lines;
      nextIndex = 0;
  }
}
    //Checks to see what bench sprites might need to be displayed on the screen, based on the background.
    function checkBenches() {
        if ($scope.line.background == 'defenseempty') {
            $scope.isDefense = true;
            $scope.isProsecutor = false;
            $scope.isWitness = false;
        } else if ($scope.line.background == 'witnessempty') {
            $scope.isWitness = true;
            $scope.isDefense = false;
            $scope.isProsecutor = false;

        } else if ($scope.line.background == 'prosecutorempty') {
            $scope.isProsecutor = true;
            $scope.isDefense = false;
            $scope.isWitness = false;
        } else {
            $scope.isProsecutor = false;
            $scope.isDefense = false;
            $scope.isWitness = false;
        }
    }

    //If there is new music, reset the audio track.
    function checkMusic() {
        if ($scope.line.music) {
            $scope.music.pause();
            $scope.music = ngAudio.load("../assets/audio/bgm/" + $scope.line.music + ".mp3");
            $scope.music.loop = true;
            $scope.music.volume = 0.5;
            $scope.music.play();
        }
    }
    //If there is a new sprite, change the sprite. Should always change when character changes.
    function checkSprite() {
        if ($scope.line.emotion) {
            $scope.emotion = $scope.currChar.emotions[$scope.line.emotion];
        }
    }
    //Checks to see if there is a new character, and also changes the name displayed above the textbox to match it.
    function checkCharacter() {
        if ($scope.line.character) {
            $scope.currChar = DataFactory.getCharacter($scope.line.character);
            $scope.charName = $scope.currChar.name;
        }
        checkSprite();
    }

    //Checks to see if there is a new background, and after setting it checks to see if the new background requires additional sprites.
    function checkBackground() {
        if ($scope.line.background) {
            $scope.background = {
                'background-image': 'url(../assets/backgrounds/' + $scope.line.background + '.png'
            };
            checkBenches();
        }
    }
    //Checks to see if the text color should be changed. Testimonies have special properties that are also enabled this way.
    function checkTextType() {
        if ($scope.line.type == 'examination') {
            $scope.texttype = {
                'color': 'green'
            };
            $scope.isExamination = true;
        } else if ($scope.line.type == 'thought') {
            $scope.texttype = {
                'color': 'dodgerblue'
            };
        } else if ($scope.line.type == 'default') {
            $scope.texttype = {
                'color': 'white'
            };
        }
    }
    //'Types' out text onto the DOM.
    $scope.typeText = function() {
        if ($scope.displayLine.length < $scope.line.line.length) {
            var index = $scope.displayLine.length;
            blip.play();
            $scope.displayLine += $scope.line.line[index];
            $timeout($scope.typeText, 30);
        } else {
            $scope.talking = false;
            $scope.isTalking = 'finished';
        }
    };
    $scope.openEvidence = function() {
        $scope.evidencePanel = true;
        $scope.evidenceLoc = $scope.lines.indexOf($scope.line);
    };
function startTestimony(){
  console.log('testimony started');
}
function startExamination(){
  console.log('examination started');
}
    //The evidence window is hidden, and the text is re-set to where the player left off.
    $scope.closeEvidence = function() {
        $scope.evidencePanel = false;
        $scope.displayLine = $scope.lines[$scope.evidenceLoc].line;
        checkTextType();
    };

    //The evidence's extra information is displayed.
    $scope.examineEvidence = function() {
        $scope.displayLine = $scope.currEvidence.info;

    };

    //The clicked evidence is set as the active piece of evidence.
    $scope.setActiveEvidence = function(evName) {
        $scope.currEvidence = DataFactory.getEvidenceItem(evName);
        $scope.displayLine = $scope.currEvidence.description;
        $scope.texttype = {
            'color': 'white'
        };
    };

    //Handles objections when pressing the 'Present' button
$scope.presentEvidence = function(evName) {
  var objection = ngAudio.load("../assets/audio/sfx/dawnobjection.wav");
  objection.play();
  $scope.activesrc = $scope.currEvidence.image;
  $scope.evidenceBox = true;
  if($scope.line.correctevidence == $scope.currEvidence.id){
    $scope.incorrect = false;
    $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].correctlines;
    $scope.lines = $scope.currScene.lines;
    $scope.closeEvidence();
    $scope.isExamination = false;
    $scope.advanceText();
  } else {
    $scope.pressLoc = $scope.lines.indexOf($scope.line);
    $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].incorrectlines;
    $scope.lines = $scope.currScene.lines;
    $scope.closeEvidence();
    $scope.incorrect = true;
    $scope.isExamination = false;
    $scope.advanceText();
  }
};

    //Alters variables when the 'Press' button is clicked such that the textbox starts displaying the presstext.
    $scope.pressWitness = function() {
        var holdIt = ngAudio.load("../assets/audio/sfx/dawnholdit.wav");
        holdIt.play();
        $scope.pressLoc = $scope.lines.indexOf($scope.line);
        $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].presstext;
        $scope.lines = $scope.currScene.lines;
        $scope.isPress = true;
        $scope.isExamination = false;
        $scope.advanceText();
    };

    //The data factory fetches all our JSON files with ajax requests, and then our variables are set up.
    DataFactory.initialize().then(function() {
        $scope.scenes = ['opening', 'courtroom', 'testimonyone'];
        $scope.music = ngAudio.load("../assets/audio/bgm/courtroomlobby.mp3");
        $scope.music.play();
        $scope.currChar = DataFactory.getCharacter('detective');
        $scope.currScene = DataFactory.getScene('opening');
        $scope.isTalking = 'talking';
        $scope.emotion = $scope.currChar.emotions['default'];
        $scope.lines = $scope.currScene.lines;
        $scope.advanceText();
        $scope.background = {
            'background-image': 'url(../assets/backgrounds/startbg.png)'
        };
        $scope.isProsecutor = false;
        $scope.isDefense = false;
        $scope.isWitness = false;
        $scope.isPress = false;
        $scope.hiddenEvidence = [false, false, false, false, false];
    });

}]);
