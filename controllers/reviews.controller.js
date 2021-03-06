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
    	if(on){
			ReviewData.find({
	    	    "timestamp": {
			        $gte: on.toISOString(),
			        $lte: new Date(on.setTime( on.getTime() + 1 * 86400000 )).toISOString()
			    }
		    }).exec(function (err, data) {
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
        if(rating === 'All'){
            rating = '';
        }
        let category = req.query.category;


        let catArray = category.split(",");

        let subcategory = req.query.subcategory;

        let queryObj = {
            "timestamp": {
                "$gte": "2010-09-30T00:00:00.000Z", //arbitrary start date
                "$lte": new Date().toISOString()
            }
        }

        if(startDate){
            let isoStartDate = new Date(startDate)
            let stringDate = new Date(isoStartDate).toISOString() // ghetto timezone workaround, this was geting the right date but applying a timezone offset
            stringDate = stringDate.split('T')[0] + 'T00:00:00.001Z'
            queryObj.timestamp.$gte = stringDate //add start of day
        }
        if(endDate){
            let isoEndDate = new Date(endDate);
            let stringDate = new Date(isoEndDate).toISOString() // ghetto timezone workaround, this was geting the right date but applying a timezone offset
            stringDate = stringDate.split('T')[0] + 'T23:59:59.999Z'
            queryObj.timestamp.$lte = stringDate //add end of day
        }
        if(rating){
            queryObj.rating = Number(rating)
        }
        if(category){
            console.log('!!category', category)
            let ediblesExist = category.indexOf('edibles');
            let hempcbdExist = category.indexOf('hemp-cbd');

            // TODO this is stupid, think of a better way to do this
            if ((ediblesExist !== -1) && (hempcbdExist !== -1)){
                // both exist, don't add this to query
            }
            if ((ediblesExist !== -1) && (hempcbdExist === -1)){
                // only edibles
                queryObj.category = 'edibles'
            }
            if ((ediblesExist === -1) && (hempcbdExist !== -1)){
                // only hemp-cbd
                queryObj.category = 'hemp-cbd'
            }
            if ((ediblesExist === -1) && (hempcbdExist === -1)){
                // neither exist
                queryObj.category = "cats" // can be any word not in field
            }

        }
        if(subcategory){
            queryObj.subcategory = String(subcategory)
        }

        console.log(queryObj)

        ReviewData.find(queryObj).exec(function (err, data) {
            if(err) return res.status(500).send({status: 'server error occurred', data: [], chartData: []})
            if(!err && data.length === 0) return res.status(200).send({status: 'No Data Found', data: [], chartData: []})
            let dateArray = []

            // TODO: refactor to an aggregae query, have mongo do this instead of blocking thread here
            let countByRating = {
                '1star': 0,
                '2star': 0,
                '3star': 0,
                '4star': 0,
                '5star': 0
            }
            data.map(function(record){
                switch(record.rating){
                    case 1:
                        countByRating['1star'] += 1;
                        break;
                    case 2:
                        countByRating['2star'] += 1;
                        break;
                    case 3:
                        countByRating['3star'] += 1;
                        break;
                    case 4:
                        countByRating['4star'] += 1;
                        break;
                    case 5:
                        countByRating['5star'] += 1;
                        break;
                }
                let simpleDate = new Date(record.timestamp).toISOString()
                simpleDate = simpleDate.split('T')[0] + 'T23:59:59.999Z'
                let offsetDateObject = new Date(simpleDate)

                let simpleDateString = `${offsetDateObject.getFullYear()}-${offsetDateObject.getMonth() + 1}-${offsetDateObject.getDate()}` // month and date are 0 based
                dateArray.push(simpleDateString)
            })

            //create final object with date and count of records that fall on that date
            let countObject = Object.values(dateArray.reduce((r,s) => {
                (!r[s])? r[s] = {date: s, count: 1} : r[s]['count']+=1;
                return r;
            }, {}));


            return res.status(200).send({status: 'Success', data: data, chartData: countObject, reviewStars: countByRating});
        });
    }

    return module;
}