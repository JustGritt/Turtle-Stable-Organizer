const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema({
    country: String,
    affiliate: String,
    url: String,
    created_at: String,
    mobile: {
        performance: {
            score: { type: Number, default: -1 },
        },
        accessibility: {
            score: { type: Number, default: -1 },
        },
        best_practices: {
            score: { type: Number, default: -1 },
        },
        seo: {
            score: { type: Number, default: -1 },
        },
        pwa: {
            score: { type: Number, default: -1 },
        }
    },
    desktop: {
        performance: {
            score: { type: Number, default: -1 },
        },
        accessibility: {
            score: { type: Number, default: -1 },
        },
        best_practices: {
            score: { type: Number, default: -1 },
        },
        seo: {
            score: { type: Number, default: -1 },
        },
        pwa: {
            score: { type: Number, default: -1 },
        }
    }
});

module.exports = mongoose.model("Report", ReportSchema);