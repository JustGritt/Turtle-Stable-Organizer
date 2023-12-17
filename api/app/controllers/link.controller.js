const Link = require("../model/link.model.js");

// ====================================
// Basic CRUD
// ====================================

// Create and Save a new Link
exports.create = (req, res) => {

    // Validate request body
    if (!req.body || !req.body.base_url) {
        return res.status(400).send({
            link: "Link content can not be empty",
        });
    }

    // Check if the link already exists
    Link.find({ base_url: req.body.base_url })
        .then((data) => {
            if (data.length > 0) {
                return res.status(400).send({
                    link: "Link already exists",
                });
            }
            // If link does not exist, create a new link here
        })
        .catch((err) => {
            res.status(500).send({
                link: err.message || "Some error occurred while retrieving links.",
            });
        });

    const link = new Link({
        country: req.body.country,
        affiliate: req.body.affiliate,
        base_url: req.body.base_url,
        mobile: {
            url: req.body.mobile.url,
            categories: {
                performance: req.body.mobile.categories.performance,
                accessibility: req.body.mobile.categories.accessibility,
                best_practices: req.body.mobile.categories.best_practices,
                seo: req.body.mobile.categories.seo,
                pwa: req.body.mobile.categories.pwa,
            }
        },
        desktop: {
            url: req.body.desktop.url,
            categories: {
                performance: req.body.desktop.categories.performance,
                accessibility: req.body.desktop.categories.accessibility,
                best_practices: req.body.desktop.categories.best_practices,
                seo: req.body.desktop.categories.seo,
                pwa: req.body.desktop.categories.pwa,
            }
        },
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    });

    link
        .save(link)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                link: err.message || "Some error occurred while creating the Link.",
            });
        });
};

exports.update = (req, res) => {
    Link.findByIdAndUpdate(
        req.params.id,
        {
            country: req.body.country,
            affiliate: req.body.affiliate,
            base_url: req.body.base_url,
            mobile: {
                url: req.body.mobile.url,
                categories: {
                    performance: req.body.mobile.categories.performance,
                    accessibility: req.body.mobile.categories.accessibility,
                    best_practices: req.body.mobile.categories.best_practices,
                    seo: req.body.mobile.categories.seo,
                    pwa: req.body.mobile.categories.pwa,
                }
            },
            desktop: {
                url: req.body.desktop.url,
                categories: {
                    performance: req.body.desktop.categories.performance,
                    accessibility: req.body.desktop.categories.accessibility,
                    best_practices: req.body.desktop.categories.best_practices,
                    seo: req.body.desktop.categories.seo,
                    pwa: req.body.desktop.categories.pwa,
                }
            },
            updated_at: req.body.updated_at
        },
        { new: true }
    ).then(link => {
        if (!link) {
            return res.status(404).send({
                message: "Link not found with id " + req.params.id
            });
        }
        res.send(link);
    }).catch(err => {
        if (err.kind === "ObjectId") {
            return res.status(404).send({
                message: "Link not found with id " + req.params.id
            });
        }
        return res.status(500).send({
            message: "Error updating link with id " + req.params.id
        });
    });
};

exports.delete = (req, res) => {
    // Update each field of the link
    Link.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    link: "Link not found with id " + req.params.id,
                });
            }
            res.send({
                link: "Link deleted successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    link: "Link not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                link: "Could not delete link with id " + req.params.id,
            });
        });
};

// ====================================
// Multiple links
// ====================================

exports.findAll = (req, res) => {
    Link.find()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                link: err.message || "Some error occurred while retrieving links.",
            });
        });
};

exports.findAllRajaCountries = (req, res) => {
    if (!res) {
        console.error('Response object is undefined');
        return;
    }

    const countries = [];
    Link.find({ affiliate: "raja" })
        .then((data) => {
            data.forEach((report) => {
                if (!countries.includes(report.country)) {
                    countries.push(report.country);
                }
            });
            res.send({
                countries: countries,
            });
        })
        .catch((err) => {
            res.status(500).send({
                link: err.message || "Some error occurred while retrieving links.",
            });
        });
};

exports.findByStrategy = (req, res) => {
    if(req.params) {
        Link.find({ strategy: req.params.strategy })
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        link: "Link not found with strategy " + req.params.strategy,
                    });
                }
                res.send(data);
            })
            .catch((err) => {
                if (err.kind === "ObjectId") {
                    return res.status(404).send({
                        link: "Link not found with strategy " + req.params.strategy,
                    });
                }
                return res.status(500).send({
                    link: "Error retrieving link with strategy " + req.params.strategy,
                });
            });
    }
    return;
};

exports.findByBaseUrl = (req, res) => {
    if(req.params) {
        Link.find({ base_url: req.params.url })
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        link: "Link not found with url " + req.params.url,
                    });
                }
                res.send(data);
            })
            .catch((err) => {
                if (err.kind === "ObjectId") {
                    return res.status(404).send({
                        link: "Link not found with url " + req.params.url,
                    });
                }
                return res.status(500).send({
                    link: "Error retrieving link with url " + req.params.url,
                });
            });
    }
    return;
};

exports.findById = (req, res) => {
    if(req.params) {
        Link.findById(req.params.id)
            .then((data) => {
                if (!data) {
                    return res.status(404).send({
                        link: "Link not found with id " + req.params.id,
                    });
                }
                res.send(data);
            })
            .catch((err) => {
                if (err.kind === "ObjectId") {
                    return res.status(404).send({
                        link: "Link not found with id " + req.params.id,
                    });
                }
                return res.status(500).send({
                    link: "Error retrieving link with id " + req.params.id,
                });
            });
    }
    return;
};

exports.findAllAffiliate = (req, res) => {
    if (!res) {
        console.error('Response object is undefined');
        return;
    }

    const affiliates = [];
    Link.find({})
        .then((data) => {
            data.forEach((report) => {
                if (!affiliates.includes(report.affiliate)) {
                    affiliates.push(report.affiliate);
                }
            });
            res.send({
                affiliates: affiliates,
            });
        })
        .catch((err) => {
            res.status(500).send({
                link: err.message || "Some error occurred while retrieving links.",
            });
        });
};

exports.linkMatch = (req, res) => {
    if(req.params) {
        Link.aggregate([
            {
                $match: {
                    $or: [
                        { "mobile.url": { $regex: req.params.url, $options: "i" } },
                        { "desktop.url": { $regex: req.params.url, $options: "i" } }
                    ]
                }
            }
        ]).then((data) => {
            if (!data) {
                return res.status(404).send({
                    link: "Link not found with url " + req.params.url,
                });
            }
            res.send(data);
        }).catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    link: "Link not found with url " + req.params.url,
                });
            }
            return res.status(500).send({
                link: "Error retrieving link with url " + req.params.url,
            });
        });
    }
    return;
};