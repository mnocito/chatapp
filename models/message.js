var mongoose = require('mongoose');
var messageSchema = new mongoose.Schema({
  createdby: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: false
  },
  date: {
    type: String
  },
  room: {
    type: String,
    default: ""
  },
  channel: {
    type: String,
    default: "main"
  }
});
mongoose.model('Message', messageSchema);