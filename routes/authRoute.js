import express from "express";
import createUser from "../controlller/userCtrl.js";
import loginUserCtrl from "../controlller/userCtrl.js";
import getallUsers from "../controlller/userCtrl.js";
import getaUser from "../controlller/userCtrl.js";
import deleteaUser from  "../controlller/userCtrl.js"
import updatedUser from "../controlller/userCtrl.js"
import updatedPassword from "../controlller/userCtrl.js"
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/authMiddleware.js"
import blockUser from "../middlewares/authMiddleware.js"
import unblockUser from "../middlewares/authMiddleware.js"
import handleRefreshToken from "../middlewares/authMiddleware.js"
import logout from "../middlewares/authMiddleware.js"
import forgotPasswordToken from "../controlller/userCtrl.js"
import resetPassword from "../controlller/userCtrl.js"
import userCart from "../controlller/userCtrl.js"
import getUserCart from "../controlller/userCtrl.js"
import emptyCart from "../controlller/userCtrl.js"


const router = express.Router();

router.post('/register', createUser);
router.put('/password',authMiddleware, updatedPassword);
router.post('/login', loginUserCtrl);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.get('/all-users',getallUsers);
router.post("/cart", authMiddleware, userCart);
router.get("/cart", authMiddleware, getUserCart);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.get('/refresh', handleRefreshToken )
router.get('/logout',logout);
router.delete('/:id', deleteaUser)
router.get('/:id',authMiddleware,isAdmin, getaUser )

router.put('/edit-user',authMiddleware, updatedUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser)



export default router;