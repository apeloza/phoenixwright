app.factory('DataFactory', ['$http', '$q', function($http, $q) {
    console.log('dataFactory running');

    //PRIVATE
    var characters;
    var scenes;
    var evidence;
    var casenum;

    //Saves all characters of a specific case in memory
    function getChars() {
        var promise = $http.get('/case' + casenum + '/characters').then(function(response) {
            console.log('Async data returned: ', response.data);
            characters = response.data;
        });
        return promise;
    }

    //Saves all scenes of a specific case in memory
    function getScenes() {
        var promise = $http.get('/case' + casenum + '/scenes').then(function(response) {
            console.log('Async data returned: ', response.data);
            scenes = response.data;
        });
        return promise;
    }

    //Saves all evidence of a given case in memory
    function getEvidence() {
        var promise = $http.get('/case' + casenum + '/evidence').then(function(response) {
            console.log('Async data returned: ', response.data);
            evidence = response.data;
        });
        return promise;
    }
    //Saves the clicked case so that both controllers can access it.
    function setCaseNum(clickednum) {
        casenum = clickednum;
    }

    //Returns the current case #.
    function getCaseNum() {
        return casenum;
    }



    //Returns a specific character
    function getChar(name) {
        return characters[name];
    }

    //Returns a specific scene
    function getScene(name) {
        return scenes[name];
    }

    //Returns an array of all scenes
    function scenesArray() {
        return scenes;
    }

    //Returns the array that specifies what order the scenes must be loaded in. This is necessary because by default angular sorts the scenes alphabetically when fetching them.
    function sceneOrder() {
        return scenes.sceneArray;
    }

    //Returns all evidence for the particular case.
    function evidenceList() {
        return evidence;
    }

    //Returns a specific evidence item
    function getEvidenceItem(name) {
        return evidence[name];
    }

    //Returns how many evidence items are in a given case
    function getEvidenceLength() {
        var length = 0;
        for (var key in evidence) {
            if (evidence.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
    }

    //Required to start the game -- this makes sure that all of our JSON files are loaded before proceeding
    function initialize() {
        var promises = [getChars(), getScenes(), getEvidence()];
        return $q.all(promises);
    }







    //PUBLIC
    var publicApi = {

        getCharacter: getChar,
        getScene: getScene,
        getEvidenceItem: getEvidenceItem,
        initialize: initialize,
        scenesArray: scenesArray,
        getEvidenceLength: getEvidenceLength,
        evidenceList: evidenceList,
        setCaseNum: setCaseNum,
        sceneOrder: sceneOrder,
        getCaseNum: getCaseNum

    };
    return publicApi;
}]);
