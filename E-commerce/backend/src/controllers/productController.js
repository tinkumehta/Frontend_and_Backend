import Product from '../models/Product.models.js'
import cloudinary from "../config/cloudinary.js"

// Get all products with filtering, pagination and search
export const getProducts = async (req, res, next) => {
    try {
        const pageSize = 12;
        const page  = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword ? {
            name : {
                $regex: req.query.keyword,
                $options: 'i'
            }
        }
        : {};

      const categoryFilter = req.query.category ? {category : req.query.category}   : {};

      const priceFilter = {};
      if (req.query.minPrice) {
        priceFilter.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        priceFilter.$lte = Number(req.query.maxPrice);
      }
      if (Object.keys(priceFilter).length > 0) {
        keyword.price = priceFilter;
      }

      const count = await Product.countDocuments({...keyword, ...categoryFilter});

      const products = await Product.find({...keyword, ...categoryFilter})
      .limit(pageSize)
      .skip(pageSize * (page -1))
      .populate('reviews')

      res.json({
        products,
        page,
        pages : Math.ceil(count/pageSize),
        total : count
      });
    } catch (error) {
        next(error);
    }
};

// get single product

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'reviews',
            populate : {
                path : 'user',
                select : 'name'
            }
        });

        if (product) {
            res.json(product);
        } else{
            res.status(404).json({message : 'Product not found'});
        }
    } catch (error) {
        next(error);
    }
};

// create Product
export const createProduct = async (req, res, next) => {
    try {
        const {name, description, price, category, stock} = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            for(const file of req.files){
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products'
                });
                images.push({
                    public_id : result.public_id,
                    url : result.secure_url
                });
            }
        }

     const product = new Product({
        name,
        description,
        price,
        category,
        stock, 
        images,
        createdBy : req.user._id
     });

     const createProduct = await product.save();
     res.status(201).json(createProduct);

    } catch (error) {
        next(error);
    }
};

// update product
export const updateProduct = async(req, res, next) => {
    try {
        const {name, description, price, category, stock} = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            // handle image updates if new images are uploaded
            if (req.files && req.files.length > 0) {
                // delete old images from cloudinary
                for (const image of product.image){
                    await cloudinary.uploader.destroy(image.public_id);
                }

                // upload new images
                let images = [];
                for(const file of req.files){
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products'
                    });
                    images.push({
                        public_id: result.public_id,
                        url : result.secure_url
                    });
                }
                product.image = images
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({message : 'Product not found'})
        }
    } catch (error) {
        next(error);
    }
}

//
