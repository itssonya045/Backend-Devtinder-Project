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

module.exports = validateSignUp;