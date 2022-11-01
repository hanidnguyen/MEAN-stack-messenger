
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

/**
 * Saves files with multer
 * Multer is used to extract and save incoming files
 * Multer takes in 3 args: request, file and callback
 * isValid used to declare the custom error validation
 * Callback error if invalid, else save to backend/images
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req,file,cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    //return the full file name (with date and extension)
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//export multer to read a file
//.single to process only one file.
module.exports =  multer({ storage: storage }).single("image");
