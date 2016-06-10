var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var saveSchema = new Schema({
currScene: {type: Object, required: true},
lines: {type: Object, required: true},
position: {type: String, required: true},
scenePosition: {type: String, required: true},
evidence: {type: Array, required: true},
evidencePlaceholder: {type: Array, required: true},
background: {type: Object, required: true},
character: {type: Object, required: true},
emotion: {type: Object, required: true},
music: {type: Object},
displayLine: {type: String}
});

var Save = mongoose.model('Save', saveSchema);

module.exports = Save;
