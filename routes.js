module.exports = function(app, ReviewData) {
    const helpController = require('./controllers/help.controller.js')(ReviewData),
          reviewsController = require('./controllers/reviews.controller.js')(ReviewData);

    app.get("/api", helpController.help);
    app.get("/api/getAllReviews", reviewsController.getAllReviews);
    app.get("/api/getCategories", reviewsController.getCategories);
    app.get("/api/getByRating/:rating", reviewsController.getByRating);
    // app.get("/api/listExchanges", helpController.exchanges);
    // app.get("/api/getLatestExchanges/:exchange?", getLatestController.getLatest);
    // app.get("/api/getBestRate/:btc", getConvertedValuesController.getBestConvertedValue)
};