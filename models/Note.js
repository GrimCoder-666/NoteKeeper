const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add a title']
    },
    content:{
        type: String,
        required: [true, 'Please add content']
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
