// Imports
const bodyParser = require('body-parser')

// Body Parser Middleware
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = (app) => {
    const Report = require("../controllers/report.controller.js");

    // ====================================
    // Reports routes
    // ====================================
    app.get("/api/reports", jsonParser, Report.findAll);
    app.get("/api/reports/id/:id", jsonParser, Report.findById);
    app.get("/api/reports/country/:country", jsonParser, Report.findByCountry);
    app.get("/api/reports/affiliate/:affiliate", jsonParser, Report.findByAffiliate);

    // Affiliate Reports Routes
    app.get("/api/reports/latest/affiliate/:affiliate",jsonParser,  Report.findLatestByAffiliate);
    app.get("/api/reports/latest/:affiliate/:country", jsonParser, Report.findLatestByAffiliateCountry);
    app.get("/api/reports/latest/count/:affiliate/:count", jsonParser, Report.findLatestByAffiliateCount);

    // Dates Reports Routes
    app.get("/api/reports/dates", jsonParser, Report.findDates);
    app.get("/api/reports/date/:from/:to", jsonParser, Report.findByDateRange)
    app.get("/api/reports/date/:date", jsonParser, Report.findByDate);
    app.get("/api/reports/url/:url", urlencodedParser, Report.findByUrl);

    // Delete Reports Routes
    app.delete("/api/reports/delete/:id", jsonParser, Report.delete);
    app.delete("/api/reports/delete/date/:date", jsonParser, Report.deleteByDate);
    app.delete("/api/reports/purge/:date", jsonParser, Report.purgeReportsByDate);
};

