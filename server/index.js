// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const app = express();
// const bcrypt = require('bcrypt');
// const port = 3000; // Replace with your desired port number
// const session = require('express-session');

// app.use(session({
//   secret: 'project', // Replace with your secret key
//   resave: false,
//   saveUninitialized: true,
// }));


// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB (replace with your MongoDB connection string)
// mongoose.connect('mongodb+srv://tauqeer:UBn3CA7HMkqgPS6u@cluster0.b6qwt0v.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Define a Mongoose schema and model for user registration
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const User = mongoose.model('User', userSchema);


// const isAuthenticated = (req, res, next) => {
//     if (req.session.user) {
//       next(); // User is authenticated, proceed to the main page
//     } else {
//       res.redirect('http://localhost:5500/signin.html'); // User is not authenticated, redirect to the sign-in page
//     }
//   };

  
// app.get('/', isAuthenticated, (req, res) => {
//     // Render the main page (only accessible when the user is signed in)
//     res.redirect(__dirname + '/index.html');
//   });


// app.post('/signup', async (req, res) => {
//   const name = req.body.name;
//   const email = req.body.email;
//   const password = req.body.password;
//   const confirm_password = req.body.confirm_password;

//   // Perform validation (e.g., check if password and confirm_password match)

//   if (password !== confirm_password) {
//     return res.status(400).send('Passwords do not match');
//   }

//   // Create a new user document in MongoDB
//   const newUser = new User({
//     name,
//     email,
//     password,
//   });

  
//   try {

//     const existingUser = await User.findOne({ email: email });

//     if (existingUser) {
//       return res.status(409).send('Email already in use');
//     }
//     // Hash the password before saving it to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new user document with the hashed password
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();
//     res.send('Signup successful');
//   } catch (error) {
//     res.status(500).send('Error while saving user');
//   }
// });



// app.post('/signin', async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     try {
//       // Find the user by email
//       const user = await User.findOne({ email: email });
  
//       if (!user) {
//         return res.status(401).send('Invalid email or password');
//       }
  
//       // Compare the provided password with the stored hashed password
//       const passwordMatch = await bcrypt.compare(password, user.password);
  
//       if (passwordMatch) {
//         // Set a session to indicate that the user is logged in
//         req.session.user = user;
//         res.send('Sign-in successful');
//       } else {
//         res.status(401).send('Invalid email or password');
//       }
//     } catch (error) {
//       res.status(500).send('Sign-in error');
//     }
//   });



// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });


// // UBn3CA7HMkqgPS6u

// // tauqeer




const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const port = 3000; // Replace with your desired port number

app.use(session({
  secret: 'project', // Replace with your secret key
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://tauqeer:UBn3CA7HMkqgPS6u@cluster0.b6qwt0v.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose schema and model for user registration
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log("HII"+req.session.user);
  if (req.session.user) {
    next(); // User is authenticated, proceed
  } else {
    res.sendFile(__dirname+'/public/signin.html'); // User is not authenticated, redirect to the sign-in page
  }
};

// Serve static HTML files
app.use(express.static(__dirname + '/public'));

app.post('/signup', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  // Perform validation (e.g., check if password and confirm_password match)

  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(409).send('Email already in use');
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.send('Signup successful');
  } catch (error) {
    res.status(500).send('Error while saving user');
  }
});

app.post('/signin', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Set a session to indicate that the user is logged in
      req.session.user = user;
      res.send('Sign-in successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Sign-in error');
  }
});

app.use('/', isAuthenticated, (req, res) => {
  // Render the main page (only accessible when the user is signed in)
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
