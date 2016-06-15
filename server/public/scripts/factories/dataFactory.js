app.factory('DataFactory', ['$http', '$q', function($http, $q) {
    console.log('dataFactory running');

    //PRIVATE
    var characters;
    var scenes;
    var evidence;
    var casenum;

function setCaseNum(clickednum){
casenum = clickednum;
}
function getCaseNum(){
  return casenum;
}

    function getChars() {
        var promise = $http.get('/case' + casenum+ '/characters').then(function(response) {
            console.log('Async data returned: ', response.data);
            characters = response.data;
        });
        return promise;
    }

    function getScenes() {
        var promise = $http.get('/case' + casenum +'/scenes').then(function(response) {
            console.log('Async data returned: ', response.data);
            scenes = response.data;
        });
        return promise;
    }

    function getChar(name) {
        return characters[name];
    }

    function getScene(name) {
        return scenes[name];
    }

    function scenesArray() {
        return scenes;
    }
function sceneOrder(){
  return scenes.sceneArray;
}
    function evidenceList() {
        return evidence;
    }

    function getEvidenceItem(name) {
        return evidence[name];
    }

    function initialize() {
        var promises = [getChars(), getScenes(), getEvidence()];
        return $q.all(promises);
    }



    function getEvidence() {
        var promise = $http.get('/case' + casenum + '/evidence').then(function(response) {
            console.log('Async data returned: ', response.data);
            evidence = response.data;
        });
        return promise;
    }

    function getEvidenceLength() {
        var length = 0;
        for (var key in evidence) {
            if (evidence.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
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
