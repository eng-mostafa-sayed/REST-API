const mongoose = require("mongoose");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

//to use currency in the mongoose
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

//adding another schema into my schema (relation)
const commentSchema = new Schema({
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    author: { type: String, required: true },
}, {
    timestamps: true,
});

const dishSchema = new Schema({
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true, unique: false },
        image: { type: String, required: true },
        price: { type: Currency, required: true, min: 0 },
        category: { type: String, required: true },
        label: { type: String, default: "", required: true },
        featured: { type: Boolean, default: false },

        //each documment in dishes has one or many comment (array of comments)
        comments: [commentSchema],
    },

    //end of the first schema element, then the time stamp
    { timestamps: true }
); //end of the schema

//construct a model of this schema(nameOfModule,schemaModule) and export it from this file to be imported in our application
var Dishes = Mongoose.model("Dish", dishSchema);
module.exports = Dishes;