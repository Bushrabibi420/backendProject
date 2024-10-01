import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloundinary url
      require: true,
    },
    converImage: {
      type: String, //cloundinary url
    },
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    password: {
      type: String,
      require: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
// how to use mongoose hooks?//save is here is a event
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password =await bcrypt.hash(this.password, 10);
  next();
});

// custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
  await bcrypt.compare(password, this.password);
};

userSchema.methods.genrateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.genrateRefreshToken = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.genrateRefreshToken = function () {};
export const User = mongoose.model("User", userSchema);
