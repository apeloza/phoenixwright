app.controller('GameController', ['$scope', '$http', '$timeout', '$location', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, $location, ngAudio, DataFactory) {
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

      //If the user clicks to advance while the game is still typing text, the whole line is immediately displayed.
      if($scope.talking === true){
        $scope.displayLine = $scope.line.line;
        return;
      }
        currIndex = $scope.lines.indexOf($scope.line) || 0;
        nextIndex = currIndex + 1;
        checkScene();
        $scope.line = $scope.lines[nextIndex];
        checkCharacter();
        checkSprite();
        checkBackground();
        checkMusic();
        checkEvidenceChange();
        checkEvidenceBox();
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';
        checkTextType();
        checkPress();
        checkPressFlags();
        checkArrows();
        checkAnim();
        checkTalking();
        checkSFX();
        checkTypeTime();
        $scope.typeText();
    };

    //This function handles going backwards, and is only functional during testimonies.
    $scope.prevText = function() {

        //This if statement makes sure you're not trying to go backwards from the first line.
        if (currIndex === -1) {
            return;
        }
        if($scope.talking === true){
          $scope.displayLine = $scope.line.line;
          return;
        }
        currIndex = $scope.lines.indexOf($scope.line) || 0;
        nextIndex = currIndex - 1;
        checkScene();
        $scope.line = $scope.lines[nextIndex];
        checkCharacter();
        checkSprite();
        checkBackground();
        checkEvidenceBox();
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';
        checkTextType();
        checkPress();
        checkArrows();
        checkTalking();
        checkSFX();
        checkTypeTime();
        $scope.typeText();
    };

    //Manual over-ride for lines of text that have no one speaking.
    function checkTalking() {
        if ($scope.line.talking) {
            $scope.isTalking = 'finished';
        }
    }

    //Adds evidence to the court record if the JSON file requests it.
    function checkEvidenceChange() {
        if ($scope.line.showEvidence) {
            $scope.hiddenEvidence[$scope.line.showEvidence] = true;
        }
        if ($scope.line.hideEvidence) {
            $scope.hiddenEvidence[$scope.line.hideEvidence] = false;
            $scope.evidencePlaceholder[$scope.line.hideEvidence] = false;
        }
    }

    //Checks to see if any SFX or manual over-ride blip noises need to be played.
    function checkSFX() {
        if ($scope.line.sfx) {
            var sfx = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.sfx);
            if ($scope.line.sfxloop) {
                sfx.loop = true;
            } else {
                sfx.loop = false;
            }
            sfx.play();
        }
        if ($scope.line.blip == "none") {
            return;
        } else if ($scope.line.blip) {
            blip = ngAudio.load("../assets/audio/sfx/sfx-" + $scope.line.blip);
        } else {
            blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
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
        //This checks to see if the user made an incorrect choice at a choice menu.
        if (nextIndex == $scope.lines.length && $scope.incorrectChoice === true) {
            $scope.currScene = $scope.choiceScene;
            $scope.lines = $scope.currScene.lines;
            nextIndex = $scope.choiceLoc;
            $scope.incorrectChoice = false;
        }

        //This checks to see if the player can advance from the testimony because they pressed for enough information.
        else if (nextIndex == $scope.lines.length && $scope.pressCheckClear === true) {
            sceneCounter++;
            $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
            $scope.lines = $scope.currScene.lines;
            nextIndex = 0;
            $scope.pressCheckClear = false;
        }

        //This checks to see if the user presented incorrect evidence, or that they are in a press statement (it returns them back to the cross-examination)
        else if (nextIndex == $scope.lines.length && $scope.isPress === true || nextIndex == $scope.lines.length && $scope.incorrectEvidence === true) {
            $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
            $scope.lines = $scope.currScene.lines;
            nextIndex = $scope.pressLoc;
            $scope.isPress = false;
            $scope.isExamination = true;
            $scope.incorrectEvidence = false;
        }

        //This checks to see if the user has reached the end of a cross examination to loop them back to the start
        else if (nextIndex == $scope.lines.length && $scope.isExamination === true) {
            nextIndex = 1;
        }

        //This checks to see if you've reached the end of a normal, run of the mill scene.
        else if (nextIndex == $scope.lines.length) {
            sceneCounter++;
            if ($scope.scenes[sceneCounter] !== undefined) {
                $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
                $scope.lines = $scope.currScene.lines;
                nextIndex = 0;
            } else {
              music.stop();
                $location.path('/title');
            }
        }
    }

    //Checks to see if a choice must be made
    function checkChoices() {
        if ($scope.line.choices) {
            $scope.choiceScene = $scope.currScene;
            $scope.isChoice = true;
            if ($scope.line.choices.choiceA) {
                $scope.isChoiceA = true;
                $scope.choiceAText = $scope.line.choices.choiceA.text;
            }
            if ($scope.line.choices.choiceB) {
                $scope.isChoiceB = true;
                $scope.choiceBText = $scope.line.choices.choiceB.text;
            }
            if ($scope.line.choices.choiceC) {
                $scope.isChoiceC = true;
                $scope.choiceCText = $scope.line.choices.choiceC.text;
            }
        }
    }

    //Checks to see what bench sprites might need to be displayed on the screen, based on the background.
    function checkBenches() {
        if ($scope.background.name == 'defenseempty.png') {
            $scope.isDefense = true;
            $scope.isProsecutor = false;
            $scope.isWitness = false;
        } else if ($scope.background.name == 'witnessempty.png') {
            $scope.isWitness = true;
            $scope.isDefense = false;
            $scope.isProsecutor = false;

        } else if ($scope.background.name == 'prosecutorempty.png') {
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
        if ($scope.line.music == "stop") {
            $scope.music.stop();
            $scope.music = '';
        } else if ($scope.line.music == "play") {
            $scope.music.play();
            $scope.music.volume = 0.75;

        } else if ($scope.line.music) {
            if ($scope.music) {
                $scope.music.pause();
            }

            $scope.music = ngAudio.load("../assets/audio/bgm/" + $scope.line.music + ".mp3");
            $scope.music.loop = true;
            $scope.music.play();
            $scope.music.volume = 0.75;

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
        if ($scope.line.name) {
            $scope.charName = $scope.line.name;
        }

        //If the judge is the active character, move the portrait up so that the judge sits properly.
        var characterPortrait = document.getElementById('portrait');
        if ($scope.currChar.name == 'Judge') {
            characterPortrait.style.height = '514px';
        } else {
            characterPortrait.style.height = '540px';
        }
    }

    //Checks to see if there is a new background, and after setting it checks to see if the new background requires additional sprites.
    function checkBackground() {
        if ($scope.line.background) {
            $scope.bgName = $scope.line.background;
            $scope.background = {
                'background-image': 'url(../assets/backgrounds/' + $scope.line.background,
                'name': $scope.line.background
            };


        }
        checkBenches();
    }

    //Plays animations on the center of the screen (e.g. Objection!), and then delays by a specified amount before hiding it
    function checkAnim() {
        if ($scope.line.anim) {
            $scope.playAnimation = true;
            $scope.animationsrc = $scope.line.anim.src;
            $scope.allowForward = false;
            $scope.allowBackward = false;
            $timeout(stopAnimation, $scope.line.anim.time);
        }
    }

//This function is used for testimonies where there is no valid evidence to present.
    function checkPressFlags() {
        if ($scope.line.pressAdd) {
            var oldFlag = false;
            for (i = 0; i < $scope.pressFlagArray; i++) {
                if ($scope.line.pressAdd == $scope.pressFlagArray[i]) {
                    oldFlag = true;
                }
            }
            if (oldFlag === false) {
                $scope.pressFlagArray.push($scope.line.pressAdd);
            }
        }
        if ($scope.line.pressReq) {
            if ($scope.line.pressReq == $scope.pressFlagArray.length) {
                $scope.pressCheckClear = true;
                $scope.pressFlagArray = [];
            } else {
                $scope.pressCheckClear = false;
            }
        }
    }
    //Checks to see if the text color should be changed. Some have special properties that are also enabled this way.
    function checkTextType() {
        if ($scope.line.type == 'intro') {
            $scope.texttype = {
                'color': 'green',
                'text-align': 'center',
            };
            $scope.charName = '';
            $scope.isTalking = 'finished';
            $scope.allowPress = false;
            $scope.allowBackward = false;
        } else if ($scope.line.type == 'examination') {
            $scope.texttype = {
                'color': 'green'
            };
            $scope.allowPress = true;
            $scope.isExamination = true;
            if ($scope.lines.indexOf($scope.line) !== 0 || $scope.lines.indexOf($scope.line) != 1) {
                $scope.allowBackward = true;
            }
        } else if ($scope.line.type == 'thought') {
            $scope.texttype = {
                'color': 'dodgerblue'
            };
            $scope.isTalking = 'finished';
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

    //Mostly used in the tutorial but also used for choices, allows for manual suppression of the forwards arrow.
    function checkArrows() {
        if ($scope.line.denyForward && $scope.line.denyBackward) {
            $scope.allowForward = false;
            $scope.allowBackward = false;
        } else if ($scope.line.denyForward) {
            $scope.allowForward = false;
        } else if ($scope.line.denyBackward) {
            $scope.allowBackward = false;
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
            $timeout($scope.typeText, $scope.texttime);
        } else {
            $scope.talking = false;
            $scope.isTalking = 'finished';
            checkChoices();
        }
    };

    //Opens the evidence window while saving information needed when the window is closed.
    $scope.openEvidence = function() {
        $scope.evidencePanel = true;
        $scope.evidenceLoc = $scope.lines.indexOf($scope.line);
        $scope.isProsecutor = false;
        $scope.isDefense = false;
        $scope.isWitness = false;
        $scope.wasEvidence = false;
        $scope.allowForward = false;
        $scope.allowPress = false;
        if ($scope.evidenceBox === true) {
            $scope.wasEvidence = true;
            $scope.evidenceBox = false;
        }

        $scope.charName = '';
        open.play();
    };

    //Stops the currently playing animation by hiding it and removing the source.
    function stopAnimation() {
        $scope.animationsrc = '';
        $scope.playAnimation = false;
        checkArrows();
    }

    //The evidence window is hidden, and the text and other images are re-set to where the player left off.
    $scope.closeEvidence = function() {
        $scope.evidencePanel = false;
        $scope.displayLine = $scope.lines[$scope.evidenceLoc].line;
        checkTextType();
        checkBenches();
        checkArrows();
        checkPress();
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
        $scope.charName = $scope.currEvidence.name;
    };

    //Prepares the case to go back to the title by turning off anything that's currently active.
    $scope.toTitle = function() {
        if ($scope.music) {
            $scope.music.stop();
        }
        close.play();
        $location.path('/title');
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
        $scope.playAnimation = true;
        $scope.animationsrc = "../assets/interfaceimages/objection.gif";
        $timeout(stopAnimation, 500);
        objection.play();
        $scope.activesrc = $scope.currEvidence.image;
        $scope.evidenceBox = true;

        //Handles correct evidence
        if ($scope.line.correctevidence == $scope.currEvidence.id) {
            $scope.incorrectEvidence = false;
            $scope.closeEvidence();

            $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].correctlines;
            $scope.lines = $scope.currScene.lines;
            $scope.isExamination = false;
            $scope.allowBackward = false;
            $scope.texttype = 'default';
            $scope.advanceText();

            //handles incorrect evidence
        } else {
            $scope.pressLoc = $scope.lines.indexOf($scope.line);
            $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].incorrectlines;
            $scope.lines = $scope.currScene.lines;
            $scope.closeEvidence();
            $scope.incorrectEvidence = true;
            $scope.isExamination = false;
            $scope.allowBackward = false;
            $scope.texttype = 'default';
            $scope.advanceText();
        }
    };

    function checkTypeTime() {
        if ($scope.line.texttime) {
            $scope.texttime = $scope.line.texttime;
        } else {
            $scope.texttime = 20;
        }
    }
    //fetches all saves from the database and stores them locally
    function getSaves() {
        $http.get('/save/all/' + $scope.caseNum)
            .then(function(saves) {
                $scope.savesArray = saves.data;
                $scope.loadingAnim = false;
            });
            $scope.loadingAnim = true;
    }

    //Brings the user to the load menu after a warning about losing progress.
    $scope.loadGame = function() {
        var confirmation = confirm("Are you sure? Current progress will be lost!");
        if (confirmation) {
            $scope.saveMenu();
        }
    };

    //Displays the menu of saves.
    $scope.saveMenu = function() {
        if ($scope.music) {
            $scope.music.pause();
        }
        $scope.inCase = false;
        $scope.scenes = DataFactory.sceneOrder();
        console.log($scope.scenes);
        $scope.evidence = DataFactory.evidenceList();
        $scope.playAnimation = false;
        $scope.currChar = DataFactory.getCharacter('noChar');
        $scope.emotion = $scope.currChar.emotions.default;
        $scope.isTalking = 'finished';
        $scope.background = {
            'background-image': 'url(../assets/backgrounds/startbg.png)'
        };
        $scope.saveSelection = true;
        $scope.allowForward = false;
        $scope.allowBackward = false;
        $scope.displayLine = '';
        $scope.charName = '';
        $scope.isProsecutor = false;
        $scope.isDefense = false;
        $scope.isWitness = false;
        $scope.pressFlagArray = [];
        getSaves();
    };

    //Saves the game. If the user has too many saves, the save fails and the user is told to delete saves.
    $scope.saveGame = function() {
        getSaves();
        if ($scope.savesArray.length >= 3) {
            alert("You have too many saves! Delete some first.");
            return;
        }

        //The save object that is sent to the server
        $scope.progressSave = {
            currScene: $scope.currScene,
            lines: $scope.lines,
            position: $scope.lines.indexOf($scope.line),
            scenePosition: sceneCounter,
            evidence: $scope.hiddenEvidence,
            evidencePlaceholder: $scope.evidencePlaceholder,
            background: $scope.background,
            character: $scope.currChar,
            emotion: $scope.emotion,
            evidenceBox: $scope.evidenceBox,
            evidenceBoxSrc: $scope.activesrc,
            music: $scope.music,
            displayLine: $scope.displayLine,
            caseNum: $scope.caseNum

        };
        $http.post('/save', $scope.progressSave)
            .then(function() {});
    };

    //This function is fired when the user does not load a save. It sets us at the start of the json file and prepares the game.
    $scope.newGame = function() {
        $scope.saveSelection = false;
        $scope.inCase = true;
        open.play();
        $scope.scenes = DataFactory.sceneOrder();
        $scope.currScene = DataFactory.getScene($scope.scenes[0]);
        $scope.lines = $scope.currScene.lines;
        $scope.line = $scope.currScene.lines[0];
        checkCharacter();
        checkSprite();
        checkBackground();
        checkMusic();
        checkSFX();
        $scope.hiddenEvidence = [];
        $scope.evidencePlaceholder = [];
        var length = DataFactory.getEvidenceLength();
        for (var i = 0; i < length; i++) {
            $scope.hiddenEvidence.push(false);
            $scope.evidencePlaceholder.push(true);
        }

        $scope.isTalking = 'talking';
        checkTypeTime();
        checkTextType();
        $scope.typeText();
        checkArrows();
    };

    //Deletes a save from the database
    $scope.deleteSave = function(id) {
        $http.delete('/save/' + id)
            .then(function() {
                getSaves();
            });
    };

    //Loads the game by bringing in a specified save object and then setting game variables based on the object.
    $scope.loadSave = function(id) {
        $scope.saveSelection = false;
        open.play();
        $http.get('/save/' + id)
            .then(function(savefile) {
                if (savefile.data.music) {
                    $scope.music = ngAudio.load(savefile.data.music.id);
                    $scope.music.loop = true;
                    $scope.music.play();
                    $scope.music.volume = 0.75;
                }
                $scope.inCase = true;
                $scope.currChar = savefile.data.character;
                $scope.charName = savefile.data.character.name;
                $scope.emotion = savefile.data.emotion;
                $scope.currScene = savefile.data.currScene;
                $scope.lines = savefile.data.lines;
                $scope.line = $scope.lines[savefile.data.position - 1];
                sceneCounter = savefile.data.scenePosition;
                $scope.background = savefile.data.background;
                checkBenches();
                $scope.evidenceBox = savefile.data.evidenceBox;
                $scope.activesrc = savefile.data.evidenceBoxSrc;
                $scope.hiddenEvidence = savefile.data.evidence;
                $scope.evidencePlaceholder = savefile.data.evidencePlaceholder;

                $scope.isTalking = 'talking';
                checkTypeTime();
                $scope.advanceText();
            });
    };

    //Alters variables when the 'Press' button is clicked such that the textbox starts displaying the presstext.
    $scope.pressWitness = function() {
        var holdIt = ngAudio.load("../assets/audio/sfx/sfx-defenseholdit.wav");
        holdIt.play();
        $scope.playAnimation = true;
        $scope.animationsrc = "../assets/interfaceimages/holdit.gif";
        $timeout(stopAnimation, 500);

        if ($scope.lines.indexOf($scope.line) + 1 == $scope.lines.length) {
            $scope.pressLoc = 0;
        } else {
            $scope.pressLoc = $scope.lines.indexOf($scope.line) + 1;

        }
        $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].presstext;
        $scope.lines = $scope.currScene.lines;
        $scope.isPress = true;
        $scope.isExamination = false;
        $scope.allowBackward = false;
        $scope.advanceText();
    };

    //Fires after the user clicks on one of the choice buttons.
    $scope.madeChoice = function(choice) {
        $scope.choiceLoc = $scope.lines.indexOf($scope.line);
        $scope.clickedChoice = true;
        $scope.isChoice = false;
        $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].choices[choice];
        $scope.lines = $scope.currScene.lines;
        if ($scope.currScene.incorrect) {
            $scope.incorrectChoice = true;
        }
        $scope.advanceText();
    };

    //The data factory fetches all our JSON files with ajax requests, and then our variables are set up.
    DataFactory.initialize().then(function() {
      $scope.caseNum = DataFactory.getCaseNum();
        $scope.saveMenu();
    });

}]);
