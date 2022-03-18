const dotenv = require("dotenv");
const fs = require("fs");
const chokidar = require("chokidar");
const {
  existsInMediaCollection,
  getNumberOfRelevantFiles,
} = require("./media-collections");
const { compressFile } = require("./compress-file");
const { fileToCollection } = require("./files-to-anki-collection");
const { renameFile } = require("./rename-file");

dotenv.config();

const videoFolderName = process.env.npm_config_initial_folder;
const folderRegex = process.env.npm_config_folder_regex;

if (!videoFolderName || !folderRegex) {
  throw "Provide folder name & regex";
}

const videosInCollection = fs.readdirSync(
  process.env.PATH_ANKI_MEDIA_COLLECTION
);
const preEdittedFilePath =
  process.env.DESKTOP_PATH + "/" + `${videoFolderName}`;

const getNewFileName = (orginalPathToFileArr, numberOfVideos) => {
  const newPath = orginalPathToFileArr
    .splice(0, orginalPathToFileArr.length - 1)
    .join("/");
  const newVideoIndex =
    numberOfVideos < 10 ? "0" + numberOfVideos : numberOfVideos;
  const newFilename = folderRegex + "-" + newVideoIndex + ".webm";
  return [`${newPath}/${newFilename}`, newFilename];
};

chokidar
  .watch(preEdittedFilePath, { ignoreInitial: true })
  .on("add", async (event) => {
    // regex check. Count up from there
    const numberOfRelevantFiles = getNumberOfRelevantFiles(
      folderRegex,
      videosInCollection
    );

    const renameIndex = numberOfRelevantFiles + 1; // pass count up from flag?

    // check if it exists in collections
    const orginalPathToFileArr = event.split("/");
    const [completeRenamedFilePath, videoFileName] = getNewFileName(
      orginalPathToFileArr,
      renameIndex
    );

    const fileInCollection = existsInMediaCollection(
      completeRenamedFilePath,
      videosInCollection
    );

    if (fileInCollection) {
      console.log("File already exists in collection");
      return;
    }

    const eventName = event.replace(" ", "").replace("(", "").replace(")", "");

    try {
      await renameFile(event, eventName);
      await compressFile(event, completeRenamedFilePath);
      await fileToCollection(completeRenamedFilePath, videoFileName);
    } catch (error) {
      console.log("error: ", error);
    }
  });
