const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your front-end URL
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define PhoneNumber Schema
const phoneNumberSchema = new mongoose.Schema({
  number: { type: String, required: true }, // Ensure phone number is a string
});
const PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true }, // Use String for phone number
  liked: { type: Boolean, default: false }, // Add a "liked" field
  password: { type: String, required: true },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);

// Endpoint to get a test message
app.get("/api/test", (req, res) => {
  res.json({ message: "This is a test API endpoint" });
});


// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error });
//   }
// });

app.get("/api/users", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// app.get("/api/users", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;

//   // Filters
//   const { name, email } = req.query;

//   try {
//     const skip = (page - 1) * limit;

//     // Build the filter object based on the provided query parameters
//     const filter = {};
//     if (name) {
//       filter.name = new RegExp(name, 'i'); // Case-insensitive regex match for name
//     }
//     if (email) {
//       filter.email = new RegExp(email, 'i'); // Case-insensitive regex match for email
//     }

//     // Fetch filtered users with pagination
//     const users = await User.find(filter).skip(skip).limit(limit);

//     const totalUsers = await User.countDocuments(filter);

//     res.json({
//       users,
//       totalUsers,
//       totalPages: Math.ceil(totalUsers / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching users", error });
//   }
// });


// Endpoint to add a new user
// app.post("/api/users", async (req, res) => {
//   const { name, email, phoneNumber } = req.body;

//   if (!name || !email || !phoneNumber) {
//     return res
//       .status(400)
//       .json({ message: "Name, email, and phone number are required" });
//   }

//   try {
//     const newUser = new User({ name, email, phoneNumber });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ message: "Error creating user", error });
//   }
// });

// app.post("/api/users", async (req, res) => {
//   const { name, email, phoneNumber } = req.body;

//   if (!name || !email || !phoneNumber) {
//     return res
//       .status(400)
//       .json({ message: "Name, email, and phone number are required" });
//   }

//   try {
//     const newUser = new User({ name, email, phoneNumber });
//     await newUser.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     // Check for duplicate email error
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: "Validation error", errors: error.errors });
//     }

//     // Handle other types of errors
//     res.status(500).json({ message: "Error creating user", error: error.message });
//   }
// });

app.post("/api/users", async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res
      .status(400)
      .json({
        message: "Name, email, phone number, and password are required",
      });
  }

  try {
    const newUser = new User({ name, email, phoneNumber, password });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }

    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ message: "username and password are required" });
  }

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    // Generate a JWT token (if needed)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("name", user.name);

    res.json({ message: "Login successful", token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Endpoint to add a new phone number
app.post("/api/phoneNumbers", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const newPhoneNumber = new PhoneNumber({ number });
    await newPhoneNumber.save();
    res.status(201).json(newPhoneNumber);
  } catch (error) {
    res.status(400).json({ message: "Error creating phone number", error });
  }
});

app.get("/api/phoneNumbers", async (req, res) => {
  try {
    const phoneNumbers = await PhoneNumber.find();
    res.status(200).json(phoneNumbers);
  } catch (error) {
    res.status(400).json({ message: "Error fetching phone numbers", error });
  }
});

// Endpoint to search users by name
app.get("/api/searchUsers", async (req, res) => {
  const searchQuery = req.query.q || "";

  if (!searchQuery) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Use a regular expression for case-insensitive search
    const users = await User.find({
      name: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
});
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id); // Adjust according to your model and schema
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
