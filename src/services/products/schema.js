const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const valid = require("validator");

const ProductCartSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  brand: String,
  price: Number,
  imageUrl: String,
  category: String,
  createdAt:Date,
  updatedAt: Date,
  reviews: [{ _id: Schema.Types.ObjectId, comment: String, rate: Number, createdAt:Date }],
  quantity: Number,
})
const productSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
   brand: {
      type: String,
      required: true,
     
    },
    imageUrl: {
        type: String
        
    },
    price: {
      type: Number,
      required: true,
      validate(value){
        if(value < 0){
          throw new Error("price must be a positive number");
        }
      }
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date,},
  
  reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'reviews',
       
    }],
  
    
  },{ timestamps: true },)
  
  productSchema.pre("save", function (next){
    
    this.updatedAt=Date.now();
    next();
  });
  productSchema.static("productReview", async function(productId){
    const projects  = await productModel.find({_id: productId}).populate("reviews");
    return projects;
});

  productSchema.post("validate", function (error, doc, next) {
    if (error) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  
  productSchema.post("save", function (error, doc, next) {
    if (error.name === "MongoError" && error.code === 11000) {
      error.httpStatusCode = 400;
      next(error);
    } else {
      next();
    }
  });
  

const productModel = mongoose.model("product",  productSchema);
module.exports = productModel; 