const mongoose = require("mongoose");

const posterSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    prompt:{
        type:String,
        required:true
    },

    imageUrl:{
        type:String,
        required:true
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "Poster",
    posterSchema
);