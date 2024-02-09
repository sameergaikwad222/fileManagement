const express = require("express");
const path = require("path");
const fileRouter = express.Router();
const multer = require("multer");
const {
  handleUploadFile,
  getFilesDetails,
  deleteFileHandler,
} = require("../controllers/fileController");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./src/storage"; // Default upload path
    let ext = path.extname(file.originalname).toLowerCase();
    ext = ext.slice(1);
    // Determine destination based on file type
    if (["jpg", "jpeg", "png"].includes(ext)) {
      uploadPath = "./src/storage/uploads/images";
    } else if (["pdf", "docx", "doc", "ppt", "xls", "txt"].includes(ext)) {
      uploadPath = "./src/storage/uploads/documents";
    } else if (["wav", "aac", "wma"].includes(ext)) {
      uploadPath = "./src/storage/uploads/audios";
    } else if (["mp4", "mov", "avi", "mkv", "avi", "mpeg"].includes(ext)) {
      uploadPath = "./src/storage/uploads/videos";
    } else {
      uploadPath = "./src/storage/uploads/others";
    }
    console.log(`File uploaded in ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({
  storage,
});

const { limiter } = require("../middlewares/rateLimiter");
const { checkAuthorization } = require("../middlewares/auth");

//  Middlewares
fileRouter.use(limiter);
fileRouter.use(checkAuthorization);
fileRouter.use(express.urlencoded({ extended: false }));

//Upload File Route
fileRouter.post("/upload", upload.single("sample"), handleUploadFile);

fileRouter.get("/all", getFilesDetails);
fileRouter.get("/:filepath", getFilesDetails);

fileRouter.delete("/", deleteFileHandler);

module.exports = { fileRouter };
