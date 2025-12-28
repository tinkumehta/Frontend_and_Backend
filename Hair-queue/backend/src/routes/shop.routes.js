 import { upload } from "../middlewares/multer.middlewares.js";
 import { verfiyJWT } from "../middlewares/auth.middlewares.js";
 import { Router } from "express";
import { createShop, getAllShops, getMyShops, getNearbyShops, getShopById, toggleShopStatus, updateShop } from "../controllers/shop.controllers.js";
 

const router = Router();

router.get('/', getAllShops);
router.get('/nearby', getNearbyShops);
router.get('/:shopId', getShopById);

// protected routes 
router.post('/create', verfiyJWT, createShop);
router.get('/my/shops', verfiyJWT, getMyShops);
router.put('/update/:shopId', verfiyJWT, updateShop);
router.patch('/:id/toggle', verfiyJWT, toggleShopStatus);

export default router;