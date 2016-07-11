var mongoose = require('mongoose');
var roomSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  channels: {
    type: Array,
    default: ["main"]
  },
  users: {
  	type: Array,
  	default: []
  },
  password: {
    type: String,
    default: ""
  }
});
mongoose.model('Room', roomSchema);