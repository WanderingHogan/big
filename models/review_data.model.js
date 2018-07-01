module.exports = function(mongoose) {
    const Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;
    
    const record = new Schema({
        _id         : ObjectId,
        text    : String,
        rating    : Number,
        timestamp: String,
        category: String,
        subcatgory: String,
        product: String
    });

    return mongoose.model('review', record);
}