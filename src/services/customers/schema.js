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

const CustomerSchema = new Schema({
    name:{
        type: String
    },
    surname:{
        type: String
    },
    cart: [ProductCartSchema],
   
    
} ,{ timestamps: true },)

CustomerSchema.static("findProductInCart", async function (id, productId) {
    const isProductThere = await customerModel.findOne({
      _id: id,
      "cart._id":productId,
    })
    return isProductThere
  })
  
  CustomerSchema.static("incrementCartQuantity", async function (
    id,
   productId,
    quantity
  ) {
    await customerModel.findOneAndUpdate(
      {
        _id: id,
        "cart._id":productId,
      },
      { $inc: { "cart.$.quantity": quantity } }
    )
  })
  
  CustomerSchema.static("addProductToCart", async function (id,product) {
    await customerModel.findOneAndUpdate(
      { _id: id },
      {
        $addToSet: { cart:product },
      }
    )
  })
  
  CustomerSchema.static("removeProductFromCart", async function (id,productId) {
    await customerModel.findByIdAndUpdate(id, {
      $pull: { cart: { _id:productId } },
    })
  })
  
  CustomerSchema.static("calculateCartTotal", async function (id) {
    const { cart } = await customerModel.findById(id)
    return cart
      .map((product) =>product.price *product.quantity)
      .reduce((acc, el) => acc + el, 0)
  })

const customerModel = mongoose.model("customers",  CustomerSchema);
module.exports = customerModel; 