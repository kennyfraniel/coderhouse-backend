import express from "express";
import createProduct from "../controlller/productCtrl.js"
import getaProduct from "../controlller/productCtrl.js"
import getallProduct from "../controlller/productCtrl.js"
import updateProduct from "../controlller/productCtrl.js"
import deleteProduct from "../controlller/productCtrl.js"
import isAdmin from "../middlewares/authMiddleware.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import addToWishList from "../controlller/productCtrl.js";
const router = express.Router();

router.post('/',authMiddleware,isAdmin, createProduct)
router.get('/:id', getaProduct)
router.put('/:id', authMiddleware,isAdmin,updateProduct)
router.delete('/:id',authMiddleware,isAdmin, deleteProduct)
router.put("/wishlist", authMiddleware, addToWishList)
router.get('/',getallProduct)

export default router