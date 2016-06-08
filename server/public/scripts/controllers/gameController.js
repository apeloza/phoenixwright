app.controller('GameController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {
    var sceneCounter = 0;
    var blip;
    var nextIndex;
    var currIndex;
    var close = ngAudio.load('../assets/audio/sfx/sfx-cancel.wav');
    var open = ngAudio.load('../assets/audio/sfx/sfx-selectblip2.wav');
    var select = ngAudio.load('../assets/audio/sfx/sfx-selectblip.wav');
    var objection = ngAudio.load("../assets/audio/sfx/defenseobjection.wav");


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
        checkPress();
        checkForward();
        if ($scope.line.testimonyStart) {
            startTestimony();
        }
        if ($scope.line.examinationStart) {
            startExamination();
        }
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';
        checkTalking();
        blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
        checkSFX();
        $scope.typeText();
    };

    //This function handles going backwards, and is only functional during testimonies.
    $scope.prevText = function() {

        //This if statement makes sure you're not trying to go backwards from the first line.
        if (currIndex === -1) {
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

        if ($scope.line.testimonyStart) {
            startTestimony();
        }
        if ($scope.line.examinationStart) {
            startExamination();
        }
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';

        blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
        $scope.typeText();
    };

    //Manual over-ride for lines of text that have no one speaking.
    function checkTalking() {
        if ($scope.line.talking) {
            $scope.isTalking = 'finished';
        }
    }
    //Adds evidence to the court record if the JSON file requests it.
    function checkNewEvidence() {
        if ($scope.line.show) {
            $scope.hiddenEvidence[$scope.line.show] = true;
        }
    }

    //Checks to see if any SFX or manual over-ride blip noises need to be played.
    function checkSFX() {
        if ($scope.line.sfx) {
            var sfx = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.sfx);
            sfx.play();
        }
        if ($scope.line.blip) {
            blip = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.blip);
        }
    }
    //Checks to see if the particular line wants to display an evidence box in the top left.
    function checkEvidenceBox(line) {
        if ($scope.line.hideBox) {
            $scope.evidenceBox = false;

        }
        if ($scope.line.showBox) {
            $scope.activesrc = '../assets/evidence/' + $scope.line.showBox;
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
            $scope.allowPress = true;
            $scope.isExamination = true;
        } else if ($scope.line.type == 'thought') {
            $scope.texttype = {
                'color': 'dodgerblue'
            };
            $scope.isExamination = false;
            $scope.allowPress = false;
        } else if ($scope.line.type == 'default') {
            $scope.texttype = {
                'color': 'white'
            };
            $scope.isExamination = false;
            $scope.allowPress = false;

        }
    }

    //Mostly used in the tutorial, allows for manual suppression or activation of the 'press' button.
    function checkPress() {
        if ($scope.line.denyPress) {
            $scope.allowPress = false;
        } else if ($scope.line.allowPress) {
            $scope.allowPress = true;
        }
    }

    //Mostly used in the tutorial, allows for manual suppression of the forwards arrow.
    function checkForward() {
      if($scope.line.denyForward){
        $scope.allowForward = false;
      } else {
        $scope.allowForward = true;
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
        console.log($scope.evidenceLoc);
        $scope.isProsecutor = false;
        $scope.isDefense = false;
        $scope.isWitness = false;
        $scope.wasEvidence = false;
        if ($scope.evidenceBox === true) {
            $scope.wasEvidence = true;
            $scope.evidenceBox = false;
        }

        $scope.charName = '';
        open.play();
    };

    function startTestimony() {
        console.log('testimony started');
    }

    function startExamination() {
        console.log('examination started');
    }
    //The evidence window is hidden, and the text and other images are re-set to where the player left off.
    $scope.closeEvidence = function() {
        $scope.evidencePanel = false;
        $scope.displayLine = $scope.lines[$scope.evidenceLoc].line;
        checkTextType();
        checkBenches();
        if ($scope.wasEvidence === true) {
            $scope.evidenceBox = true;
            $scope.wasEvidence = false;
        }
        close.play();
        $scope.charName = $scope.currChar.name;

    };

    //The evidence's extra information is displayed.
    $scope.examineEvidence = function() {
        $scope.displayLine = $scope.currEvidence.info;
        open.play();
    };

    //Prepares the case to go back to the title by turning off anything that's currently active.
    $scope.toTitle = function() {
        $scope.music.stop();
    };
    //The clicked evidence is set as the active piece of evidence.
    $scope.setActiveEvidence = function(evName) {
        $scope.currEvidence = DataFactory.getEvidenceItem(evName);
        $scope.displayLine = $scope.currEvidence.description;
        $scope.texttype = {
            'color': 'white'
        };
        select.play();
    };

    //Handles objections when pressing the 'Present' button
    $scope.presentEvidence = function(evName) {
      debugger;
        objection.play();
        $scope.activesrc = $scope.currEvidence.image;
        $scope.evidenceBox = true;
        if ($scope.line.correctevidence == $scope.currEvidence.id) {
            $scope.incorrect = false;
            $scope.closeEvidence();

            $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].correctlines;
            $scope.lines = $scope.currScene.lines;
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
        var holdIt = ngAudio.load("../assets/audio/sfx/defenseholdit.wav");
        holdIt.play();
        $scope.pressLoc = $scope.lines.indexOf($scope.line) + 1;
        $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].presstext;
        $scope.lines = $scope.currScene.lines;
        $scope.isPress = true;
        $scope.isExamination = false;
        $scope.advanceText();
    };

    //The data factory fetches all our JSON files with ajax requests, and then our variables are set up.
    DataFactory.initialize().then(function() {
        $scope.scenes = ['tutorial', 'opening', 'courtroom', 'testimonyone'];
        $scope.music = ngAudio.load("../assets/audio/bgm/courtroomlobby.mp3");
        $scope.music.play();
        $scope.currChar = DataFactory.getCharacter('tutorial');
        $scope.currScene = DataFactory.getScene('tutorial');
        $scope.isTalking = 'talking';
        $scope.lines = $scope.currScene.lines;
        $scope.advanceText();
        $scope.background = {
            'background-image': 'url(../assets/backgrounds/startbg.png)'
        };
        $scope.isProsecutor = false;
        $scope.isDefense = false;
        $scope.isWitness = false;
        $scope.isPress = false;
        $scope.allowForward = true;
        $scope.hiddenEvidence = [false, false, false, false, false];
    });

}]);
