const express = require("express");

const customerRoute = express.Router();
const CustomerSchema = require("./schema");
const customerModel = require("./schema");
const ProductModel = require("../products/schema")

customerRoute.get("/", async(req, res, next)=>{
    const customers = await CustomerSchema.find(req.query)
    
    res.send({data:customers, Total: customers.length})
    
})
customerRoute.get("/:id", async(req, res, next)=>{
    try {
        const id = req.params.id
        const customer =await CustomerSchema.findById(id)
        
        if(customer){
          res.send(customer)
        }else{
          const error = new Error()
          error.httpStatusCode = 404;
          next(error)
        }
       } catch (error) {
         error.httpStatusCode = 404
         next("While reading customers from DB problem occured") // next is sending the error to the error handler
       }
    
})
customerRoute.post("/", async(req, res, next)=>{
    try {
      
        const newCustomer = new CustomerSchema(req.body)
          const{_id} = await newCustomer.save()
          res.status(201).send("New Customers added with Id: "+_id)
            
       
       
        }catch (error) {
        next(error)
      }
    
})
customerRoute.put("/:id", async(req, res, next)=>{
    const customer = await CustomerSchema.findByIdAndUpdate(req.params.id, req.body)
  if(customer){
    res.status(204).send(customer)
  }else{
    const error = new Error(`Customer with id ${req.params.id} not found`);
    error.httpStatusCode=404
    next(error)
  }
 
    
})
customerRoute.delete("/:id", async(req, res, next)=>{
    const customer = await CustomerSchema.findByIdAndDelete(req.params.id);
  if(customer){
    res.send(`Deleted customers with id: ${req.params.id}`)
  }else {
    const error = new Error(`customer with id ${req.params.id} not found`)
    error.httpStatusCode = 404
    next(error)
  }
    
})


customerRoute.post("/:id/add-to-cart/:productId", async (req, res, next) => {
    try {
      
      const product = await ProductModel.productReview(req.params.productId)
      //console.log(product)
      if (product) {
          const newProduct ={...product.toObject(), quantity: 1}
        console.log(newProduct)
        const isProductAvailable= await customerModel.findProductInCart(
          req.params.id,
          req.params.productId
        )
        if (isProductAvailable) {
         
          await customerModel.incrementCartQuantity(
            req.params.id,
            req.params.productId,
            1
          )
          res.send("Quantity incremented")
        } else {
          // the product is not in the cart
          await customerModel.addProductToCart(req.params.id, newProduct)
          res.send("New product added!")
        }
      } else {
        const error = new Error()
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      next(error)
    }
  })
  
  customerRoute.delete("/:id/remove-from-cart/:productId", async (req, res, next) => {
    try {
      await CustomerSchema.removeProductFromCart(req.params.id, req.params.productId)
      res.send("Ok")
    } catch (error) {
      next(error)
    }
  })
  
  customerRoute.get("/:id/calculate-cart-total", async (req, res, next) => {
    try {
      const total = await CustomerSchema.calculateCartTotal(req.params.id)
      res.send({ total })
    } catch (error) {
      next(error)
    }
  })
module.exports=customerRoute;