const dotenv = require("dotenv");
const fs = require("fs");
const chokidar = require("chokidar");
const {
  existsInMediaCollection,
  getNumberOfRelevantFiles,
} = require("./media-collections");
const { compressFile } = require("./compress-file");
const {
  fileToCollection,
  copyFileTing,
} = require("./files-to-anki-collection");
const { renameFile } = require("./rename-file");
const { deleteFile } = require("./delete-file");

dotenv.config();

const videoFolderName = process.env.npm_config_initial_folder;
const folderRegex = process.env.npm_config_folder_regex;

if (!videoFolderName || !folderRegex) {
  throw "Provide folder name & regex";
}

const preEdittedFilePath =
  process.env.DESKTOP_PATH + "/" + `${videoFolderName}`;

const postRename =
  process.env.DESKTOP_PATH + `/${videoFolderName}` + "/editted";

const renamePath =
  process.env.DESKTOP_PATH + `/${videoFolderName}` + "/renamed";

const getNewFileName = (orginalPathToFileArr, numberOfVideos) => {
  const newPath = orginalPathToFileArr
    .splice(0, orginalPathToFileArr.length - 1)
    .join("/");
  const newVideoIndex =
    numberOfVideos < 10 ? "0" + numberOfVideos : numberOfVideos;
  const newFilename =
    folderRegex + "-" + newVideoIndex + "-compressed" + ".webm";

  const removeRenamedPath = `${newPath}/editted/${newFilename}`.replace(
    "renamed/",
    ""
  );
  return [removeRenamedPath, `${newPath}/editted/${newFilename}`, newFilename];
};

fs.watch(preEdittedFilePath, async (_, fileName) => {
  if (
    fileName.includes(".DS_Store") ||
    fileName.includes("pre-compress-screen")
  ) {
    return console.log("Bloddy .DS sting Or pre-compress-secreen");
  }

  const filePathToThis = process.env.DESKTOP_PATH + "/" + fileName;
  const foldername = "/renamed/";
  const newFilePath =
    preEdittedFilePath +
    foldername +
    fileName
      .replace(" ", "")
      .replace("(", "")
      .replace(")", "")
      .replace("screen", "pre-compress-screen");

  try {
    await copyFileTing(filePathToThis, newFilePath);
  } catch (error) {
    console.log("error: ", error);
  }
  return console.log("finished!");
});

// compress file
fs.watch(renamePath, async (_, fileName) => {
  // chokidar.watch(renamePath, { ignoreInitial: true }).on("add", async (event) => {
  const videosInCollection = fs.readdirSync(
    process.env.PATH_ANKI_MEDIA_COLLECTION
  );
  const numberOfRelevantFiles = getNumberOfRelevantFiles(
    folderRegex,
    videosInCollection
  );

  const renameIndex = numberOfRelevantFiles + 1; // pass count up from flag?

  console.log("renameIndex in rename: ", renameIndex);
  // check if it exists in collections
  const orginalPathToFileArr = renamePath + "/" + fileName;
  const orginalPathToFileArrSplit = orginalPathToFileArr.split("/");
  const [completeRenamedFilePath] = getNewFileName(
    orginalPathToFileArrSplit,
    renameIndex
  );
  console.log("completeRenamedFilePath: ", completeRenamedFilePath);

  try {
    await compressFile(orginalPathToFileArr, completeRenamedFilePath);
  } catch (error) {
    console.log("error: ", error);
  }
  return console.log("finished!");
});

fs.watch(postRename, async (eventType, fileName) => {
  console.log("eventType: ", eventType);
  console.log("fileName: ", fileName);
  const videosInCollection = fs.readdirSync(
    process.env.PATH_ANKI_MEDIA_COLLECTION
  );
  const pathToCheckFileInCollection =
    process.env.PATH_ANKI_MEDIA_COLLECTION + "/" + fileName;
  const fileInCollection = existsInMediaCollection(
    pathToCheckFileInCollection,
    videosInCollection
  );

  if (fileInCollection) {
    return console.log(
      "File already exists in collection (send to collection)"
    );
  }
  const absolutePathOfThis =
    process.env.DESKTOP_PATH + "/" + videoFolderName + "/editted/" + fileName;
  try {
    await fileToCollection(absolutePathOfThis, fileName);
  } catch (error) {
    console.log("error: ", error);
  }
  return console.log("finished! (send to collection)");
});

// // // send to collection
// chokidar.watch(postRename, { ignoreInitial: true }).on("add", async (event) => {
// if (event.includes("compressed")) {
//   return console.log("File already compressed");
// }
// const numberOfRelevantFiles = getNumberOfRelevantFiles(
//   folderRegex,
//   videosInCollection
// );

// const renameIndex = numberOfRelevantFiles + 1; // pass count up from flag?

// // check if it exists in collections
// const orginalPathToFileArr = event.split("/");

// const fileInCollection = existsInMediaCollection(
//   completeRenamedFilePath,
//   videosInCollection
// );

// if (fileInCollection) {
//   return console.log("File already exists in collection");
// }
//   const videoFileNameSplit = event.split("/");
//   const videoFilename = videoFileNameSplit[videoFileNameSplit.length - 1];

//   console.log("videoFileNameSplit", videoFileNameSplit);
//   console.log("videoFilename: ", videoFilename);
//   console.log("postRename event: ", event);
//   try {
//     await fileToCollection(event, videoFilename);
//   } catch (error) {
//     console.log("error: ", error);
//   }
//   return console.log("finished!");
// });

// Things that need not be here

// const getNewFileNameFinal = (orginalPathToFileArr, numberOfVideos) => {
//   const newPath = orginalPathToFileArr
//     .splice(0, orginalPathToFileArr.length - 1)
//     .join("/");
//   const newVideoIndex =
//     numberOfVideos < 10 ? "0" + numberOfVideos : numberOfVideos;
//   const newFilename =
//     folderRegex + "-" + newVideoIndex + "-compressed" + ".webm";

//   const removeRenamedPath = `${newPath}/editted/${newFilename}`.replace(
//     "renamed/",
//     ""
//   );
//   return [removeRenamedPath, `${newPath}/editted/${newFilename}`, newFilename];
// };
