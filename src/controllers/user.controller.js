import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import ApiResponse from "../utils/ApiResponse.js";
const resgisterUSer = asyncHandler(async (req, res) => {
  //  get user details from frontend
  //  validation_not empty
  //  check if user already exists: username,email
  // check for images,check for avatar
  // upload them to cloudninery,avatar
  //  create user object -create entry in db
  // remove password and refresh token field from response(when sending res to frontned)
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  console.log("email:", email);

  // if(fullName===""){
  //   throw new ApiError(400,"fullname is required")
  // }

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageocalPath = req.files?.coverImage[0]?.path;
  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.lenght > 0
  ) {
    avatarLocalPathLocalPath = req.files.avatar[0].path;
  } else {
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.lenght > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  } else {
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
    email,
    password,
    username: username.toLowerCase(),
  });

  const CreatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!CreatedUser) {
    throw new ApiError(500, "Something went wong while registring the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUser, "USer Registered Sucessfully"));
});

// login User___
const loginUser = asyncHandler(async (req, res) => {
  //  extract data from req.body
  //  username or email exits or not
  //  find the user(user exits or not)
  //  password check
  //  access and refresh token(genrate these both and have to send it to the user)
  // send token in cookies(secure cookies)

  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username or password is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw ApiError(404, "User doesn't exist");
  }
   
  const isPasswordValid=await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw ApiError(401, "password incorrect");
  }
    

});

export default resgisterUSer;
export { loginUser };
