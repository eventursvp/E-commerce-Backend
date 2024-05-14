const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tenant = new Schema({
    addedBy: { type: Schema.ObjectId, ref: 'Users' },
    name: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Tenant', Tenant,'Tenant');
