import mongoose from "mongoose";

const validateMongoDBid = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error ('Esta id no es validad')
};

export default validateMongoDBid;