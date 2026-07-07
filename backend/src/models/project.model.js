const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    projectName:{
        type:String,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    items:[
        {
            type:{
                type:String,
                enum:[
                    "linkedin",
                    "image-analysis",
                    "caption",
                    "script"
                ]
            },

            content:{
                type:mongoose.Schema.Types.Mixed
            },

            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
},
{
    timestamps:true
}
);

module.exports = mongoose.model("Project", projectSchema);