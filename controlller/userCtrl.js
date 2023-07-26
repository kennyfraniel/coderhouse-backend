import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../config/jwToken.js";
import validateMongoDBid from "../utils/validateMongoDBid.js";
import generateRefreshToken from "../config/refreshToken.js";
import Cart from "../models/cartCtrl.js"
import jwt, { decode } from "jsonwebtoken"
import crypto from "crypto"
import sendEmail from "./emailCtrl.js";

const createUser = asyncHandler ( async (req,res)=> {
    const email =req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser) {
        // crear usuario
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
      throw new Error ('User already exists');
    };
});

const loginUserCtrl = asyncHandler(async(req, res) => {
  const {email,password} = req.body;
  //checkear si el usuario existe
  const findUser = await User.findOne ({email});
  if(findUser && await findUser.isPasswordMatched(password)){
    const refreshToken= await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(findUser.id, {
      refreshToken: refreshToken,
    },
    {new: true})
    res.cookie('refreshToken',refreshToken,{
      httpOnly:true,
      maxAge: 72 * 60 * 60 * 1000,
    })
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token:generateToken(findUser?._id),
    });
  } else {
    throw new Error("Información invalida")
  }
});

// manejar un token nuevo
const handleRefreshToken = asyncHandler (async(req,res)=>{
  const cookie = req.cookies;
  if(!cookie?.refreshToken) throw new Error ('No existe el token nuevo en las Cookies');
  const refreshToken = cookie.refreshToken;
  const user= await User.findOne({refreshToken});
  if(!user) throw new Error('No existe el token en DB');
  jwt.verify(refreshToken,procces.env.JWT_SECRET,(err,decoded => {
    if (err || user.id !== decode.id) {
      throw new Error('Hay un error con el Token nuevo')
    } else {
      const accessToken = generateToken(user?._id)
      res.json({accessToken})
    }
  }))
})

//logout
const logout= asyncHandler(async(req,res) =>{
  const cookie = req.cookies; 
  if (!cookie?.refreshToken) throw new Error ('No existe el token nuevo en las Cookies')
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({refreshToken});
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly:true,
      secure:true,
    });
    return res.sendStatus(204); //prohibido
  }
  await User.findOneAndUpdate(refreshToken), {
    refreshToken: "",
  };
  res.clearCookie("refreshToken"), {
    httpOnly: true,
    secure: true,
  }
  return res.sendStatus(204); 
});

// actualizar un usuario
const updatedUser = asyncHandler (async (req, res)=> {
  const {_id} = req.user;
  validateMongoDBid(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(_id,{
      firstname:req?.body?.firstname,
      lastname:req?.body?.lastname,
      email:req?.body?.email,
      mobile:req?.body?.mobile,
    }, {
      new:true,
    });
    res.json(updatedUser)
  } catch (error){
    throw new Error (error)
  }
})



//mostrar todos los usuarios
const getallUser = asyncHandler (async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers)
  } catch (error) {
    throw new Error (error)
  }
})

//mostrar un solo usuario
const getaUser = asyncHandler(async (req,res) =>{
  const {id} = req.params;
  validateMongoDBid(id);
  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    })
  } catch (error){
    throw new Error(error)
  }
  
})

//borrar un usuario
const deleteaUser = asyncHandler(async (req,res) =>{
  const {id} = req.params;
  validateMongoDBid(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    })
  } catch (error){
    throw new Error(error)
  }
  
})

//bloquear usuario

const blockUser= asyncHandler (async (req,res) => {
  const {id} =req.params;
  validateMongoDBid(id);
  try {
    const blockusr= await User.findByIdAndUpdate(
      id,
      {
      isBlocked:true

    }, {
      new:true
    }
    );
    res.json({
      message: "Usuario blockeado"
    })
  }catch(error) {
    throw new Error (error)
  }
});
const unblockUser= asyncHandler (async (req,res) => {
  const {id} =req.params;
  validateMongoDBid(id);
  try {
    const unblock= await User.findByIdAndUpdate(id,{
      isBlocked:false

    }, {
      new:true
    }
    );
    res.json({
      message: "Usuario desbloqueado"
    })
    
  }catch(error) {
    throw new Error (error)
  }
});

const updatePassword = asyncHandler (async (req, res) =>{
  const {_id} = req.user;
  const {password} = req.body;
  validateMongoDBid(_id);
  const user = await User.findById(_id);
  if(password){
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword)
  }else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler (async (req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) throw new Error ('Usuario no encontrado con este email');
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Por favor, clickea en este link para resetear tu contraseña! Este link es valido por 10 minutos. <a href='http://localhost:5000/api/user/reset-password/${token}>Click aquí!</a>`
    const data = {
      to: email,
      subject: "Olvidé el link",
      htm: resetURL,
      text: "Usuario"
    };
    sendEmail(data);
    res.json(token);
  }catch (error) {
    throw new Error (error)
  }
});

const resetPassword = asyncHandler(async (req,res) => {
  const { password} = req.body;
  const {token} = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken:hashedToken,
    passwordResetExpires:{$gt:Date.now() },
  })
  if(!user) throw new Error ("Token Expirado, Por favor intenta de vuelta más tarde.");
  user.password = password;
  user.passwordResetToken= undefined;
  user.passwordResetExpires= undefined;
  await user.save();
  res.json(user);
})

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let products = [];
    const user = await User.findById(_id);
    //chequeando si el carrito existe
    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDBid(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});


export default (createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser, blockUser, unblockUser, handleRefreshToken,logout, updatePassword, forgotPasswordToken,resetPassword, userCart, getUserCart,emptyCart) ;
