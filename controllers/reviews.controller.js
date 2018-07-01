'use strict';
module.exports =function(ReviewData) {
    let module = {};

    // TODO: standardize response with response codes, something like:
    // {status: success, data: <data>} or {status: fail, message: 'something fucked up'}
    module.getAllReviews = function(req, res){
        ReviewData.find().exec(function (err, data) {
            return res.jsonp(data);
        });
    }

    module.getCategories = function(req, res) {
    	// returns distinct categories and subcategories
    	ReviewData.aggregate([
		    { "$group": { 
		        "_id": { 
		            "category" : "$category",
		            "subcatgory": "$subcatgory"
		        },
		        "count": { $sum: 1 }
		     }}
     	]).exec(function (err, data) {
            return res.jsonp(data);
		});
    }

    module.getByRating = function(req, res) {
    	// example http://localhost:3000/api/getByRating/1
    	let rating = req.params.rating

    	ReviewData.find().where({ "rating": rating }).exec(function (err, data) {
			// add error handling'range, can only be 1, 2, 3, 4, 5
            return res.jsonp(data);
		});
 
    }


    return module;
}