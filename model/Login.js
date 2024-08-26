const  mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  Username: { type: String, unique: true, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Record: [
    {
      Type: { type: String, required: true }, 
      Subdomain: { type: String }, 
      Value: { type: String },
      Comment: { type: String },
    }
  ],
  domain: { type: String,default: ''} 
},{timestamps:true});

const Login = mongoose.model('Login', LoginSchema);

module.exports = Login;
