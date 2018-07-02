module.exports = function(app, ReviewData) {
    // shared response wrapper so we can error codes and data consistently
    const commonResponseWrapper = {
    	code: 404,
    	content: {
    		message: 'Request Failed',
    		data: {}
    	}
    }

    const helpController = require('./controllers/help.controller.js')(commonResponseWrapper, ReviewData),
          reviewsController = require('./controllers/reviews.controller.js')(commonResponseWrapper, ReviewData);

    app.get("/api", helpController.help);
    app.get("/api/getAllReviews", reviewsController.getAllReviews);
    app.get("/api/getCategories", reviewsController.getCategories);
    app.get("/api/getByRating/:rating", reviewsController.getByRating);
    app.get("/api/getByString/:searchWord", reviewsController.getByString);
    app.get("/api/getByDate", reviewsController.getByDate);
    app.get("/api/reviewFilter", reviewsController.reviewFilter);

};