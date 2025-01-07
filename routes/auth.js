/**
 * This controls authentication. for now we have just three auth, login, logout and
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).select(
      "+password"
    );
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send({ success: false, error: "Login failed!" });
    }
    const { password, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign(
      { id: user._id, isAdmin: user.role === "supervisor" },
      process.env.JWT_SECRET
    );
    res.send({ success: true, user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error });
  }
});

//logout
router.post("/logout", async (req, res) => {
  try {
    // On the server side, we can suggest the client delete the token
    res.send({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, error: "Logout failed!" });
  }
});

module.exports = router;
