const { StatusCodes } = require("http-status-codes");
const path = require("path");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uploadProductImageLocal = async (req, res) => {
  // check if file is exists
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  let productImage = req.files.image;
  // check format
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image file");
  }
  // check size
  if (productImage.size > process.env.MAX_FILE_UPLOAD) {
    throw new CustomError.BadRequestError(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

const uploadProductImageCloud = async (req, res) => {
  // check if file is exists
  if (!req.files) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  let productImage = req.files.image;
  // check format
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image file");
  }
  // check size
  if (productImage.size > process.env.MAX_FILE_UPLOAD) {
    throw new CustomError.BadRequestError(
      `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`
    );
  }
  const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(productImage.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImageLocal,
  uploadProductImageCloud,
};
