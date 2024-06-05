const { schema } = require('./User');
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    class_id: {
        type: String,
        require: true,
        unique: true,
    },
    class_name: {
        type: String,
        require: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }, 
    students: {
        type:[mongoose.Schema.Types.ObjectId], ref:'User'
    }
});

module.exports = mongoose.model('Class', ClassSchema);