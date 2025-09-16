import {Router} from 'express'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct, } from '../controllers/productController.js'
import {protect, admin} from '../middleware/auth.js'
import upload from '../middleware/upload.js'

 const router = Router();

 router.route("/")
    .get(getProducts)
    .post(protect, admin, upload.array('images', 5), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, admin, upload.array('images', 5), updateProduct)
    .delete(protect, admin, deleteProduct);