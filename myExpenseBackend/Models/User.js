const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    upiId: {
      type: String,
      default: "",
    },

    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
  },
  { timestamps: true }
);

// ✅ Generate JWT token (FIXED)
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      userId: this._id,   // IMPORTANT
      email: this.email,
    },
    process.env.JWT_SECRET, // ✅ FIXED KEY NAME
    {
      expiresIn: "10d",
    }
  );
};

module.exports = mongoose.model("User", UserSchema);
