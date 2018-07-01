const fs = require('fs')
const csv = require('fast-csv');

let inDataStream = fs.createReadStream("leafly_reviews_scrape.csv");

// create file/stream
var csvWriter = fs.createWriteStream('leafly_fixed_dates.csv')

//write headers
csvWriter.write('id, text, rating, timestamp, category, subcategory, product\n')

let replaceQuotes = (a)=> {
	// regex to escape dbl quotes - for whatever reason mongo doesn't use the standard backslash to escape a char - you have to doubleup what you want to escape, thus 2 dbl quotes
	return a.replace(/\"/g,'""')
}

let csvStream = csv
    .parse({headers: true})
    .on("data", function(data){
    	let d = new Date(data.timestamp).toISOString();

    	csvWriter.write(`${Number(data.id)},"${replaceQuotes(data.text)}",${Number(data.rating)},${d},"${data.category}","${data.subcatgory}","${data.product}"\n`)
    })
    .on("end", function(){
         console.log("done");
    });
 
inDataStream.pipe(csvStream);

