app.factory('DataFactory', ['$http', function($http) {
  console.log('dataFactory running');

  //PRIVATE
  var characters;
  var scenes;
  var evidence;

  function getChars() {
    var promise = $http.get('/game/characters').then(function(response) {
      console.log('Async data returned: ', response.data);
      characters = response.data;
    });
    return promise;
  }
  function getChar(name) {
    return characters[name];
  }
  /*
  function getScenes() {
    var promise = $http.get('/game/scenes').then(function(response) {
      console.log('Async data returned: ', response.data);
      scenes = response.data;
    });
    return promise;
  }
  function getEvidence() {
    var promise = $http.get('/game/evidence').then(function(response) {
      console.log('Async data returned: ', response.data);
      evidence = response.data;
    });
    return promise;
  }
*/

  //PUBLIC
  var publicApi = {
    getCharacters: function() {
      return getChars();
    },
    returnCharacters: function() {
      //return our array
      return characters;
    },
    getCharacter: getChar

  };
  return publicApi;
}]);
