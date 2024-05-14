const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Brand = new Schema(
    {
        name: { type: String, required: true },
        addedBy: { type: Schema.ObjectId, ref: 'Admin' },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Brand", Brand,"Brand");