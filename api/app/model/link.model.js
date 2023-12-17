const mongoose = require("mongoose");

const LinkSchema = mongoose.Schema({
    country: String,
    affiliate: String,
    base_url: String,
    mobile: {
        url: String,
        categories: {
            performance: Boolean,
            accessibility: Boolean,
            best_practices: Boolean,
            seo: Boolean,
            pwa: Boolean,
        }
    },
    desktop: {
        url: String,
        categories: {
            performance: Boolean,
            accessibility: Boolean,
            best_practices: Boolean,
            seo: Boolean,
            pwa: Boolean,
        }
    },
    created_at: Date,
    updated_at: Date
});

module.exports = mongoose.model("Link", LinkSchema);