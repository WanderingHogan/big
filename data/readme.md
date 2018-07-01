## import data to mongo

[instructions here](https://docs.mlab.com/migrating/#import)

```mongoimport -h <server>:<port> -d <dbname> -c <collectionName> -u <usrname> -p <password> --type csv --headerline --file data/leafly_reviews_scrape.csv```