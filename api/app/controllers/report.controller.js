const Report = require("../model/report.model.js");

// ====================================
// Basic CRUD
// ====================================

// Create and Save a new Report
exports.create = (req, res) => {
    const report = new Report({
        country: req.body.country,
        affiliate: req.body.affiliate,
        url: req.body.url,
        created_at: req.body.created_at,
        mobile: {
            performance: {
                score: req.body.mobile.performance.score,
                audits: req.body.mobile.performance.audits,
            },
            accessibility: {
                score: req.body.mobile.accessibility.score,
                audits: req.body.mobile.accessibility.audits,
            },
            best_practices: {
                score: req.body.mobile.best-practices.score,
                audits: req.body.mobile.best-practices.audits,
            },
            seo: {
                score: req.body.mobile.seo.score,
                audits: req.body.mobile.seo.audits,
            },
            pwa: {
                score: req.body.mobile.pwa.score,
                audits: req.body.mobile.pwa.audits,
            },
        },
        desktop: {
            performance: {
                score: req.body.desktop.performance.score,
                audits: req.body.desktop.performance.audits,
            },
            accessibility: {
                score: req.body.desktop.accessibility.score,
                audits: req.body.desktop.accessibility.audits,
            },
            best_practices: {
                score: req.body.desktop.best-practices.score,
                audits: req.body.desktop.best-practices.audits,
            },
            seo: {
                score: req.body.desktop.seo.score,
                audits: req.body.desktop.seo.audits,
            },
            pwa: {
                score: req.body.desktop.pwa.score,
                audits: req.body.desktop.pwa.audits,
            },
        },
    });
};

// Update a report identified by the reportId in the request
exports.update = (req, res) => {
    Report.findByIdAndUpdate(
            req.params.reportId, {
                report: req.body.report,
            }, {
                new: true
            }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.reportId,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.reportId,
                });
            }
            return res.status(500).send({
                report: "Error updating report with id " + req.params.reportId,
            });
        });
};

// Update the desktop report identified by the created_at and url in the request
exports.updateDesktopReport = async (report, req, res) => {
    Report.findOneAndUpdate({
        created_at: report.created_at,
        url: report.url,
    }, {
        desktop: {
            performance: {
                score: report.desktop.performance.score,
            },
            accessibility: {
                score: report.desktop.accessibility.score,
            },
            best_practices: {
                score: report.desktop.best_practices.score,
            },
            seo: {
                score: report.desktop.seo.score,
            },
            pwa: {
                score: report.desktop.pwa.score,
            },
        },
    }, {
        new: true
    })
    .then((data) => {
        if (!data && res) {
            return res.status(404).send({
                report: "Report not found with created_at " + report.created_at + " and url " + report.url,
            });
        }
    })
    .catch((err) => {
        if (res) {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with created_at " + report.created_at + " and url " + report.url,
                });
            }
            return res.status(500).send({
                report: "Error updating report with created_at " + report.created_at + " and url " + report.url,
            });
        } else {
            console.error(err);
        }
    });
};

// Delete a report with the specified reportId in the request
exports.delete = (req, res) => {
    Report.findByIdAndRemove(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.id,
                });
            }
            res.send({
                report: "Report deleted successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                report: "Could not delete report with id " + req.params.id,
            });
        });
};

// ====================================
// Multiple reports
// ====================================

// Retrieve all reports from the database.
exports.findAll = (req, res) => {
    Report.find({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                report: err.message || "Some error occurred while retrieving reports.",
            });
        });
};

// Find all reports by country
exports.findByCountry = (req, res) => {
    Report.find({
            country: req.params.country,
        })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with country " + req.params.country,
                });
            }
            res.send(data);
        })

};

// Find all reports by affiliate
exports.findByAffiliate = (req, res) => {
    Report.find({
            affiliate: req.params.affiliate,
        })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with affiliate " + req.params.affiliate,
            });
        }
    );
};

// Find all reports by url (encoded)
exports.findByUrl = (req, res) => {
    Report.find({
            url: "https://www." + req.params.url,
        })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with url " + req.params.url,
                });
            }
            console.log(data)
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with url " + req.params.url,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with url " + req.params.url,
            });
        });
};

exports.findDates = (req, res) => {
    Report.find({})
        .distinct("created_at")
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with date " + req.params.date,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with date " + req.params.date,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with date " + req.params.date,
            });
        });
};

// Find all reports by date
exports.findByDate = (req, res) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(req.params.date)) {
        return res.status(400).send({
            report: "Date format is not valid. Please use YYYY-MM-DD",
        });
    }

    Report.find({
            created_at: req.params.date
        })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with date " + req.params.date,
                });
            }
            res.send(data);
        }
    );
};

// Find all reports by date (from, to)
exports.findByDateRange = (req, res) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(req.params.from) && !regex.test(req.params.to)) {
        return res.status(400).send({
            report: "Date format is not valid. Please use YYYY-MM-DD",
        });
    }

    Report.find({
            created_at: {
                $gte: req.params.from,
                $lt: req.params.to,
            },
        })
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with date " + req.params.from + " to " + req.params.to,
                });
            }
            res.send(data);
        }
    );
};

// Find the last 10 reports by affiliate and country
exports.findLatestByAffiliateCountry = (req, res) => {
    Report.find({
            affiliate: req.params.affiliate,
            country: req.params.country,
        })
        .sort({
            created_at: -1
        })
        .limit(10)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate + " and country " + req.params.country,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate + " and country " + req.params.country,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with affiliate " + req.params.affiliate + " and country " + req.params.country,
            });
        });
};

// Find the X latest reports by affiliate
exports.findLatestByAffiliateCount = (req, res) => {
    Report.find({
            affiliate: req.params.affiliate,
        })
        .sort({
            created_at: -1
        })
        .limit(parseInt(req.params.count))
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with affiliate " + req.params.affiliate,
            });
        });
};

// ====================================
// Single report
// ====================================

// Find a single report with a reportId
exports.findById = (req, res) => {
    console.log(req.params)

    Report.findById(req.params.id)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.id,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with id " + req.params.id,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with id " + req.params.id,
            });
        });
};

// Find latest report by affiliate
exports.findLatestByAffiliate = (req, res) => {
    Report.find({
            affiliate: req.params.affiliate,
        })
        .sort({
            created_at: -1
        })
        .limit(5)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with affiliate " + req.params.affiliate,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with affiliate " + req.params.affiliate,
            });
        });
};

// Find latest report by country
exports.findLatestByCountry = (req, res) => {
    Report.find({
            country: req.params.country,
        })
        .sort({
            created_at: -1
        })
        .limit(1)
        .then((data) => {
            if (!data) {
                return res.status(404).send({
                    report: "Report not found with country " + req.params.country,
                });
            }
            res.send(data);
        })
        .catch((err) => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    report: "Report not found with country " + req.params.country,
                });
            }
            return res.status(500).send({
                report: "Error retrieving report with country " + req.params.country,
            });
        });
};

// Find all reports by date and delete them
exports.deleteByDate = (req, res) => {
    console.log(req.params.date);

    Report.deleteMany({
            created_at: req.params.date,
        })
        .then((data) => {
            if (!data.n) { // if no documents were deleted
                return res.status(200).send({
                    report: "Reports deleted successfully! :)",
                });
            }
            res.send({
                report: "Reports deleted successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    report: "Report not found for the date " + req.params.date,
                });
            }
            return res.status(500).send({
                report: "Could not delete report with date " + req.params.date,
            });
        });
}

// Find all reports with a score of -1 and delete them
exports.purgeReportsByDate = (req, res) => {
    Report.deleteMany({
            created_at: req.params.date,
            $or: [
                {'desktop.performance.score': -1},
                {'desktop.accessibility.score': -1},
                {'desktop.best_practices.score': -1},
                {'desktop.seo.score': -1},
                {'desktop.pwa.score': -1}
            ]
        })
        .then((data) => {
            if (!data.n) { // if no documents were deleted
                return res.status(200).send({
                    report: "All reports are up to date! :)",
                });
            }
            res.send({
                report: "Reports deleted successfully!"
            });
        })
        .catch((err) => {
            if (err.kind === "ObjectId" || err.name === "NotFound") {
                return res.status(404).send({
                    report: "Report not found for the date " + req.params.date,
                });
            }
            return res.status(500).send({
                report: "Could not delete report with date " + req.params.date,
            });
        });
};