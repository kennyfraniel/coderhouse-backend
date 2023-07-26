import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim:true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category: {
        type:String,
        required: true,
    },
    brand: {
        type:String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true, 
    } ,
    sold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true,
    },
    ratings: [{
        star:Number,
        postedby:{type:mongoose.Schema.Types.ObjectId, ref: "User"},
    },
    ],
    

},
{timestapms: true});


const schemaProduct = mongoose.model("Product",productSchema);
export default schemaProduct;