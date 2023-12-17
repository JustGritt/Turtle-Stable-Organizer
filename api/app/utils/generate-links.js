const Link = require("../controllers/link.controller.js");

// 1. Build the link list
exports.linkBuilder = async (link, strategy, categories = ["performance", "seo", "accessibility", "best-practices", "pwa"]) => {
    // Check if the link is already in the database
    const base_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const target_url = link.url;
    let url = `${base_url}?url=${target_url}&strategy=${strategy}`;

    // Append each categories
    categories.forEach(category => {
        url += `&category=${category}`;
    });

    return url;
}

// Add the link to the database
exports.createLink = async (link) => {
    const newLink = new Link({
        country: link.country,
        affiliate: link.affiliate,
        mobile: {
            url: link.mobile.url,
            categories: {
                performance: link.mobile.categories.performance,
                accessibility: link.mobile.categories.accessibility,
                best_practices: link.mobile.categories.best_practices,
                seo: link.mobile.categories.seo,
                pwa: link.mobile.categories.pwa,
            }
        },
        desktop: {
            url: link.desktop.url,
            categories: {
                performance: link.desktop.categories.performance,
                accessibility: link.desktop.categories.accessibility,
                best_practices: link.desktop.categories.best_practices,
                seo: link.desktop.categories.seo,
                pwa: link.desktop.categories.pwa,
            }
        },
        created_at: link.created_at,
        updated_at: link.updated_at
    });

    // Save Link in the database
    newLink
        .save(newLink)
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.error("Error saving link to database", err);
        });
}
