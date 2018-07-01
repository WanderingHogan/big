## import data to mongo

First - run the upload script ```uploadscript.js``` > this converts the date format into something easier to use with mongo. It's hard coded to take leafly_reviews_scrape.csv, but you can either add a flag ot manually change the csv location.

This generates 'leafly_fixed_dates.csv'

then follow the import instructions from mlab:
[instructions here](https://docs.mlab.com/migrating/#import)

```mongoimport -h <server>:<port> -d <dbname> -c <collectionName> -u <usrname> -p <password> --type csv --headerline --file data/leafly_fixed_dates.csv```

	mongoimport -h foohost -d bardb -c fooc --type tsv --fields col1.int32\(\),col2.double\(\),col3.string\(\) --columnsHaveTypes --file path/to/file.txt

