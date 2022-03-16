const dotenv = require("dotenv");
const fs = require("fs");
const chokidar = require("chokidar");
const {
  existsInMediaCollection,
  getNumberOfRelevantFiles,
} = require("./media-collections");

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

const getNewFileName = (orginalPathToArr, numberOfVideos) => {
  const newPath = orginalPathToArr
    .splice(0, orginalPathToArr.length - 1)
    .join("/");
  const newVideoIndex =
    numberOfVideos < 10 ? "0" + numberOfVideos : numberOfVideos;
  const newFilename = videoFolderName + "-" + newVideoIndex + ".webm";
  return `${newPath}/${newFilename}`;
};

chokidar
  .watch(preEdittedFilePath, { ignoreInitial: true })
  .on("add", (event, _) => {
    // regex check. Count up from there
    const numberOfRelevantFiles = getNumberOfRelevantFiles(
      folderRegex,
      videosInCollection
    );
    const renameIndex = numberOfRelevantFiles + 1;
    // check if it exists in collections
    const orginalPathToArr = event.split("/");

    const completeRenamedFile = getNewFileName(orginalPathToArr, renameIndex);

    const fileInCollection = existsInMediaCollection(
      completeRenamedFile,
      videosInCollection
    );

    console.log("numberOfRelevantFiles:", numberOfRelevantFiles);
    console.log("renameIndex:", renameIndex);
    console.log("orginalPathToArr:", orginalPathToArr);
    console.log("completeRenamedFile:", completeRenamedFile);
    console.log("fileInCollection:", fileInCollection);

    if (fileInCollection) {
      return;
    }

    // fs.rename(event, completeRenamedFile, function (err) {
    //   if (err) console.log("ERROR: " + err);
    // });
  });
