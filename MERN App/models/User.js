const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    email: { type: String, requied: true, unique: true },
    password: {
        type: String,
        requied: true,
        todos: [{ type: Types.ObjectId, ref: 'Todo' }]
    }
});

module.exports = model('User', schema);