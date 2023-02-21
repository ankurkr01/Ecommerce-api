const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  verifyTokenAndAuthorisation,
} = require("../middleware/verifyTokenAndAuthorisation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { verifyTokenAndAdmin } = require("../middleware/verifyTokenAndAdmin");

// update
router.put("/:id", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updateUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// delete
router.delete("/:id", verifyTokenAndAuthorisation, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("user has been deleted...");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get all user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(3)
      : await User.find();

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// get user satat
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
