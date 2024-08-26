const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const Login = require('./model/Login');
const { MongoConnect } = require('./MongoConnect/MongoConnect');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'Anuj5926';

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoConnect();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  token = token.replace(/^"|"$/g, '');
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Access Denied', status: false });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY); 
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid Token', status: false });
  }
};

app.post('/login', async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const newLogin = await Login.findOne({ Username, Password });
    if (newLogin) {
      const token = jwt.sign(
        { Username },
        SECRET_KEY,
        { expiresIn: '1h' });
      console.log('Token', token, '\n')
      res.status(201).json({ newLogin, Token: token, status: true });
    } else {
      res.status(201).json({ message: "Please Enter Valid credentials", status: false });
    }
  } catch (err) {
    console.log(err);
    res.status(201).json({ message: "Please Enter Valid credentials", status: false });
  }
});

app.post('/signUp', async (req, res) => {
  const { Username, Email, Password } = req.body;
  try {
    console.log(req.body);
    const newLogin = await Login.create({ Username, Email, Password });
    res.status(201).json({ newLogin, status: true });
  } catch (err) {
    res.status(201).json({ message: "User Already Exist", status: false });
  }
});

app.post('/getData',verifyToken, async (req, res) => {
  const { Email } = req.body;
  try {
    console.log(req.body);
    const newLogin = await Login.findOne({ Email });
    if (newLogin) {
      res.status(201).json({ newLogin, status: true });
    } else {
      res.status(404).json({ message: "User Not Exist", status: false });
    }
  } catch (err) {
    res.status(201).json({ message: "Server Error", status: false });
  }
});
app.post('/newRecord',verifyToken, async (req, res) => {
  const { Email, Type, Subdomain, Value, Comment } = req.body;
  try {
    console.log(req.body);
    let Record = {
      Type,
      Subdomain,
      Value,
      Comment
    }
    const updatedLogin = await Login.findOneAndUpdate({ Email }, { $push: { Record } },
      { new: true });

    if (updatedLogin) {
      res.status(201).json({ updatedLogin, status: true });
    } else {
      res.status(404).json({ message: "User Not Exist", status: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});

app.post('/addDomain',verifyToken, async (req, res) => {
  const { Email, domain } = req.body;
  try {
    console.log(req.body);
    const updatedLogin = await Login.findOneAndUpdate(
      { Email },
      { $set: { domain } },
      { new: true }
    );

    if (updatedLogin) {
      res.status(201).json({ updatedLogin, status: true });
    } else {
      res.status(404).json({ message: "User Not Exist", status: false });
    }
  } catch (err) {
    res.status(201).json({ message: "Server Error", status: false });
  }
});

app.post('/DeleteRecord',verifyToken, async (req, res) => {
  const { Email, _id } = req.body;
  try {
    console.log(req.body);
    const user = await Login.findOneAndUpdate(
      { Email: Email },
      { $pull: { Record: { _id: _id } } },
      {new:true}
    );

    if (user) {
      console.log("Found Record:", user);
      res.status(201).json({ updatedLogin:user, status: true });
    } else {
      console.log("Record not found.");
    }
  } catch (error) {
    console.error("Error finding record:", error);
  }
});
app.post('/EditRecord',verifyToken, async (req, res) => {
  const { Email, _id,Type, Subdomain, Value, Comment } = req.body;
  try {
    console.log(req.body);
    const user = await Login.findOneAndUpdate(
      { Email: Email, "Record._id": _id },
      {
        $set: {
          "Record.$.Type": Type,
          "Record.$.Subdomain": Subdomain,
          "Record.$.Value": Value,
          "Record.$.Comment": Comment,
        },
      },
      { new: true } 
    );

    if (user) {
      console.log("Found Record:", user);
      res.status(201).json({ updatedLogin:user, status: true });
    } else {
      console.log("Record not found.");
    }
  } catch (error) {
    console.error("Error finding record:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});