const mongoose = require('mongoose');

const applicationLogsSchema = new mongoose.Schema({
    module: { type: String, required: true },
    activityName: { type: String, required: true },
    preValue: [{ type: mongoose.Schema.Types.Mixed }],
    nextValue: [{ type: mongoose.Schema.Types.Mixed }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }

}, { timestamps: true });

const ApplicationLog = mongoose.model('ApplicationLog', applicationLogsSchema, 'ApplicationLog');

module.exports = ApplicationLog;
