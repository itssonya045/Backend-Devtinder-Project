const validator = require("validator")

const validateSignUp = (req)=>{
    const { firstName , lastName, emailId ,  password} = req.body ;

    if(! firstName|| !lastName){
        throw new Error("Name is not valid.")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Email is Not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid")
    }
}

const validEditprofile = (req)=>{
    const allEditfeild =["firstName","lastName","about","skill","photoUrl","gender"]
    const isAllowed = Object.keys(req.body).every((feild)=>allEditfeild.includes(feild))
    return isAllowed
}
module.exports = validateSignUp;
module.exports = validEditprofile;