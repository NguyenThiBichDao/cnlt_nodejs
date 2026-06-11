// ===============================
// src/models/HinhAnhXe.js
// ===============================

const mongoose = require("mongoose");

const hinhAnhXeSchema = new mongoose.Schema(
{
    maXe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Xe"
    },

    urlHinh: {
        type: String,
        required: true
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("HinhAnhXe", hinhAnhXeSchema);