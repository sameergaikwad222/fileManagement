const { error } = require("console");
const { logger } = require("../utils/logs");
const fs = require("fs").promises;

// ========================================= File Operations =========================================

async function handleUploadFile(req, res) {
  try {
    return res.status(201).json({
      status: "Sucesss",
      filetype: req?.file?.mimetype || "",
      filename: req?.file?.filename || "",
      originalname: req?.file?.originalname || "",
    });
  } catch (error) {
    logger.error(error.message);
    logger.error("handleUploadFile>Error");
    return res.status(500).json({ status: "Failed", error: error.message });
  }
}

async function getFilesDetails(req, res) {
  let foldertype = req.query?.foldertype || "all";
  let limit = req.query?.limit || 100;
  if (limit > 1000) return res.status(400).json({ message: "over limit" });
  if (
    !["all", "images", "audios", "videos", "others", "documents"].includes(
      foldertype
    )
  ) {
    return res
      .status(400)
      .json({ status: "failed", message: "folder type is invalid" });
  }

  const filePath =
    foldertype == "all"
      ? "./src/storage/uploads/"
      : `./src/storage/uploads/${foldertype}`;
  try {
    let files = await fs.readdir(filePath);
    if (files.length)
      return res.status(200).json({ status: "Success", data: files });
    else return res.status(404).json({ status: "Success", data: null });
  } catch (error) {
    logger.error(error.message);
    logger.error("getFilesDetails>Error", error.message);
    return res.status(500).json({ status: "Failed", message: error.message });
  }
}

async function deleteFileHandler(req, res) {
  let filePath = req.query?.filePath || "";
  if (filePath === "") return false;
  let [baseFolder, file] = filePath.split("/");
  if (
    !baseFolder ||
    !file ||
    !["audios", "videos", "documents", "images", "others"].includes(baseFolder)
  )
    return res
      .status(400)
      .json({ status: "failed", message: "incorrect file name" });

  if (baseFolder[0] !== "/") {
    filePath = `/${filePath}`;
  }

  fs.unlink(`./src/storage/uploads${filePath}`, (err) => {
    if (err) {
      logger.error(error.message);
      return res.status(500).json({ message: "Error while deleting file" });
    }
  });
  return res.status(201).json({ message: "File deleted successfully" });
}

module.exports = { handleUploadFile, getFilesDetails, deleteFileHandler };
