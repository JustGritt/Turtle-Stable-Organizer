// Imports
const bodyParser = require('body-parser')

// Body Parser Middleware
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = (app) => {
    const Link = require("../controllers/link.controller.js");

    // ====================================
    // Reports routes
    // ====================================
    app.get("/api/routes/affiliates", jsonParser, Link.findAllAffiliate);

    // ====================================
    // Links routes
    // ====================================
    app.get("/api/links", jsonParser, Link.findAll);
    app.get("/api/links/raja/countries", jsonParser, Link.findAllRajaCountries);
    app.get("/api/links/strategy/:strategy", jsonParser, Link.findByStrategy);
    app.get("/api/links/:id", jsonParser, Link.findById);

    // Single Links Routes
    app.post("/api/links/add", jsonParser, Link.create);
    app.put("/api/links/update/:id", jsonParser, Link.update);
    app.delete("/api/links/delete/:id", jsonParser, Link.delete);
    app.get("/api/links/match/:url", urlencodedParser, Link.linkMatch);
    app.get("/api/links/url/:url", urlencodedParser, Link.findByBaseUrl);
};

