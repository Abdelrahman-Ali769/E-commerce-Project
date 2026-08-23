class ApiFeatures {
    constructor(mongooseQuery, QueryString) {
        this.mongooseQuery = mongooseQuery
        this.QueryString = QueryString
    }
    // filter
    filter() {
        const queryStringObj = { ...this.QueryString };
        const excludeFields = ["page", "limit", "sort", "fields", "KeyWord"];
        excludeFields.forEach((field) => delete queryStringObj[field]);
        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))
        return this
    }
    //sort
    sort() {
        if (this.QueryString.sort) {
            const sortBy = this.QueryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this
    }
    // Field limit by req.query.Fields
    Fields() {
        if (this.QueryString.fields) {
            const fields = this.QueryString.fields.split(",").join(" ")
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this
    }
    //Search
    Search() {
        if (this.QueryString.KeyWord) {
            const query = {}
            query.$or = [
                { title: { $regex: this.QueryString.KeyWord, $options: 'i' } },
                { description: { $regex: this.QueryString.KeyWord, $options: 'i' } }
            ]
            this.mongooseQuery = this.mongooseQuery.find(query)
        }
        return this
    }
    //paginate 
    paginate() {
        const page = this.QueryString.page * 1 || 1;
        const limit = this.QueryString.limit * 1 || 5;
        const skip = (page - 1) * limit;
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this
    }
}
module.exports =ApiFeatures;