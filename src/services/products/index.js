const express = require("express");
const fs = require("fs");
const path = require("path")
const {join} = require("path")
const multer = require("multer")
const {writeFile} = require("fs-extra")
const q2m = require("query-to-mongo")

const productchema = require("./schema");
const productModel = require("./schema");


const router = express.Router()
const upload = multer({})
const productsFolderPath =join(__dirname, "../../../public/image/products")
const readFile = (fileName) => {
  const buffer = fs.readFileSync(path.join(__dirname, fileName))
  const fileContent = buffer.toString()
  return JSON.parse(fileContent)
}


// router.use(multer({dest: "../../public/img", rename: function(){}}))
router.post("/:id/upload", upload.single("avatar"), async (req, res, next) => {
  
  console.log(req.file.buffer)
  try {
    //const productsDB = await productchema.
    
  //   const newDb = productsDB.map((x) => {
  //     if(x.productId === req.params.productId){
  //         x.image = `http://localhost:${port}/image/products/${req.params._id}.jpg`
  //     }
  //     return x;
  // })

  //   fs.writeFileSync(path.join(__dirname, "products.json"), JSON.stringify(newDb))

  //   await writeFile(
  //     join(productsFolderPath, `${req.params._id}.jpg`),
  //     req.file.buffer
  //   )
  } catch (error) {
    console.log(error)
  }
  res.send("ok")
})

router.get("/", async(req, res, next) => {
  try {
    const parsedQuery = q2m(req.query)
    const products = await productchema.find(parsedQuery.criteria, parsedQuery.options.fields).populate("reviews")
    .sort(parsedQuery.options.sort)
    .limit(parsedQuery.options.limit).skip(parsedQuery.options.skip)
   
    res.send({Total_Products: products.length, products})
  } catch (error) {
    next(error)
  }
})

router.get("/:id", async(req, res, next) => {
    try {
     const id = req.params.id
     const product =await productchema.findById(id)
     
     if(product){
       res.send(product)
     }else{
       const error = new Error()
       error.httpStatusCode = 404;
       next(error)
     }
    } catch (error) {
      error.httpStatusCode = 404
      next("While reading products from DB problem occured") // next is sending the error to the error handler
    }
  })

  router.get("/:id/review", async(req, res, next) => {
    try {
     const product = await productModel.productReview(req.params.id)
     res.send(product)
    } catch (error) {
      error.httpStatusCode = 404
      next("While reading products review from DB problem occured") // next is sending the error to the error handler
    }
  })
  
router.post("/",async(req, res, next) => {
    try {
      
      const newProduct = new productchema(req.body)
        const{_id} = await newProduct.save()
        res.status(201).send("New products added with Id: "+_id)
          
     
     
      }catch (error) {
      next(error)
    }
  }
)



router.put("/:id", async(req, res) => {
  const product = await productchema.findByIdAndUpdate(req.params.id, req.body)
  if(product){
    res.status(204).send(product)
  }else{
    const error = new Error(`user with id ${req.params.id} not found`);
    error.httpStatusCode=404
    next(error)
  }
 
})

router.delete("/:id", async(req, res) => {
  const product = await productchema.findByIdAndDelete(req.params.id);
  if(product){
    res.send(`Deleted products with id: ${req.params.id}`)
  }else {
    const error = new Error(`Product with id ${req.params.id} not found`)
    error.httpStatusCode = 404
    next(error)
  }

})

//Review 

module.exports = router
