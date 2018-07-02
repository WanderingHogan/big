'use strict';
module.exports =function(commonResponseWrapper, ReviewData) {
    let module = {};

    // TODO: standardize response with response codes, something like:
    // {status: success, data: <data>} or {status: fail, message: 'something fucked up'}
    module.getAllReviews = function(req, res){
        ReviewData.find().exec(function (err, data) {
    		if(err) return res.status(500).send({status: 'server error occurred'})
    		if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
            return res.status(200).send({status: 'Success', data: data});
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
    		if(err) return res.status(500).send({status: 'server error occurred'})
    		if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
            return res.status(200).send({status: 'Success', data: data});
		});
    }

    module.getByRating = function(req, res) {
    	// example http://localhost:3000/api/getByRating/1
    	let rating = req.params.rating

    	ReviewData.find().where(
    		{ "rating": rating }
    	).exec(function (err, data) {
			// add error handling'range, can only be 1, 2, 3, 4, 5
     		if(err) return res.status(500).send({status: 'server error occurred'})
     		if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
            return res.status(200).send({status: 'Success', data: data});
		});
 
    }

    module.getByString = function(req, res) {
    	// TODO: add regex/lookup to treat in database - as space
    	let searchWord = new RegExp(req.params.searchWord, 'gi'); //g is for global, i for case insensitive

    	ReviewData.find({product: searchWord}).exec(function (err, data) {
     		if(err) return res.status(500).send({status: 'server error occurred'})
     		if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
            return res.status(200).send({status: 'Success', data: data});
		});
 
    }

    module.getByDate = function(req, res) {
    	let lowDate = req.query.lowDate;
    	let highDate = req.query.highDate;
    	// let on = new Date(req.query.on).toISOString();
    	let on = new Date(req.query.on);
    	console.log(on)
    	console.log(new Date(on.setTime( on.getTime() + 1 * 86400000 )))
    	if(on){
			ReviewData.find({
	    	    "timestamp": {
			        $gte: on.toISOString(),
			        $lte: new Date(on.setTime( on.getTime() + 1 * 86400000 )).toISOString()
			    }
		    }).exec(function (err, data) {
		    	console.log(err, data)
	     		if(err) return res.status(500).send({status: 'server error occurred'})
	     		if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
	            else return res.status(200).send({status: 'Success', data: data});
			});
    	}
    }

    module.reviewFilter = function(req, res) {

        //optional params, return all if not specified
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let rating = req.query.rating;
        let category = req.query.category;
        let subcategory = req.query.subcategory;

        let queryObj = {
            "timestamp": {
                "$gte": "2010-09-30T00:00:00.000Z", //arbitrary start date
                "$lte": new Date().toISOString()
            }
        }

        if(startDate){
            queryObj.timestamp.$gte = String(new Date(startDate).toISOString())
        }
        if(endDate){
            queryObj.timestamp.$lte = String(new Date(endDate).toISOString())
        }
        if(rating){
            queryObj.rating = Number(rating)
        }
        if(category){
            queryObj.category = String(category)
        }
        if(subcategory){
            queryObj.subcategory = String(subcategory)
        }
        // console.log(queryObj)

        ReviewData.find(queryObj).exec(function (err, data) {
            if(err) return res.status(500).send({status: 'server error occurred'})
            if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found'})
            let dateArray = []

            // TODO: refactor to an aggregae query, have mongo do this instead of blocking thread here
            data.map(function(record){
                let simpleDate = new Date(record.timestamp)
                let simpleDateString = `${simpleDate.getFullYear()}-${simpleDate.getMonth()}-${simpleDate.getDate()}`
                dateArray.push(simpleDateString)
            })

            //create final object with date and count of records that fall on that date
            let countObject = Object.values(dateArray.reduce((r,s) => {
                (!r[s])? r[s] = {date: s, count: 1} : r[s]['count']+=1;
                return r;
            }, {}));

            return res.status(200).send({status: 'Success', data: data, chartData: countObject});
        });
    }

    return module;
}