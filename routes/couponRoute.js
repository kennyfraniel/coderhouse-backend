import express from "express";
import createCoupon from "../controlller/couponCtrl.js"
import getAllCoupons from "../controlller/couponCtrl.js"
import updateCoupon from "../controlller/couponCtrl.js"
import deleteCoupon from "../controlller/couponCtrl.js"
import getCoupon from "../controlller/couponCtrl.js"
import authMiddleware from "../middlewares/authMiddleware.js"
import isAdmin from "../middlewares/authMiddleware.js"
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);
router.get("/:id", authMiddleware, isAdmin, getAllCoupons);
router.get ("/:id", authMiddleware, isAdmin, getCoupon);
router.put("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);

export default router;
