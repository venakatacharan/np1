const mongoose = require('mongoose');

const Schema = mongoose.Schema

const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false, // Default value for completed is false
    }
},
{ timestamps: true})  // Automatically handles createdAt and updatedAt fields

module.exports = mongoose.model('Task',taskSchema)
