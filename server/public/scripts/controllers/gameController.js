app.controller('GameController', ['$scope', '$http', '$timeout', 'ngAudio', 'DataFactory', function($scope, $http, $timeout, ngAudio, DataFactory) {
    var sceneCounter = 0;
    var blip;

    //This function handles advancing to the next line of text, and swapping variables as needed.
    $scope.advanceText = function() {
        var currIndex = $scope.lines.indexOf($scope.line) || 0;
        var nextIndex = currIndex + 1;
        if (nextIndex == $scope.lines.length && $scope.isPress === true) {
            $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
            $scope.lines = $scope.currScene.lines;
            nextIndex = $scope.pressLoc;
            console.log(nextIndex);
            $scope.isPress = false;
        } else if (nextIndex == $scope.lines.length && $scope.isTestimony === true) {
            nextIndex = 0;
        } else if (nextIndex == $scope.lines.length) {
            sceneCounter++;
            $scope.currScene = DataFactory.getScene($scope.scenes[sceneCounter]);
            $scope.lines = $scope.currScene.lines;
            nextIndex = 0;
        }
        $scope.line = $scope.lines[nextIndex];
        checkCharacter();
        checkBackground();
        checkMusic();
        checkTextType();
        $scope.displayLine = '';
        $scope.talking = true;
        $scope.isTalking = 'talking';

        blip = new Audio('../assets/audio/sfx/sfx-' + $scope.currChar.defaultSound + '.wav');
        $scope.typeText();
    };

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
        if ($scope.line.type == 'testimony') {
            $scope.texttype = {
                'color': 'green'
            };
            $scope.isTestimony = true;
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
    };
    $scope.closeEvidence = function() {
        $scope.evidencePanel = false;
    };
    $scope.examineEvidence = function() {

    };
    $scope.setActiveEvidence = function() {

    };
    //Alters variables when the 'Press' button is clicked such that the textbox starts displaying the presstext.
    $scope.pressWitness = function() {
        console.log("Pressed witness");
        console.log($scope.currScene);
        $scope.pressLoc = $scope.lines.indexOf($scope.line);
        console.log($scope.pressLoc);
        $scope.currScene = $scope.currScene.lines[$scope.lines.indexOf($scope.line)].presstext;
        $scope.lines = $scope.currScene.lines;
        $scope.isPress = true;

        $scope.advanceText();
    };

    //The data factory fetches all our JSON files with ajax requests, and then our variables are set up.
    DataFactory.initialize().then(function() {
        $scope.scenes = ['opening', 'courtroom', 'testimonyone'];
        $scope.music = ngAudio.load("../assets/audio/bgm/courtroomlobby.mp3");
        $scope.music.loop = true;
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
    });

}]);
