const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const postEdittedFilePath = process.env.DESKTOP_PATH + "/post-Diners-s01-e10";

const videos = fs.readdirSync(postEdittedFilePath);
const filteredVideos = videos.filter((video) => video !== ".DS_Store");

const videosInCollection = fs.readdirSync(
  process.env.PATH_ANKI_MEDIA_COLLECTION
);

const videoFolderName =
  process.env.npm_config_initial_folder || "post-Diners-s01-e10";

const regexString = process.env.npm_config_regex_name || "Diners-s01-e10";

const initialFolderPath = process.env.DESKTOP_PATH + "/" + videoFolderName;

const initialFolderPathFiles = fs
  .readdirSync(initialFolderPath)
  .filter((file) => file !== ".DS_Store" && !videosInCollection.includes(file));

const lastIndexInCollections = videosInCollection.filter((video) =>
  video.includes(regexString)
).length;

filteredVideos.forEach((videoPath, index) => {
  const completeRenamedFile =
    `${postEdittedFilePath}/Diners-s01-e10-` + videoPath;
  const prePathFile = `${postEdittedFilePath}/${videoPath}`;
  console.log("completeRenamedFile: ", completeRenamedFile);
  fs.rename(prePathFile, completeRenamedFile, function (err) {
    if (err) console.log("ERROR: " + err);
  });
});
