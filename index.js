const dotenv = require("dotenv");
const fs = require("fs");
const chokidar = require("chokidar");

dotenv.config();

const videoFolderName = process.env.npm_config_initial_folder;

const preEdittedFilePath =
  process.env.DESKTOP_PATH + "/pre-" + `${videoFolderName}`;

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
    const numberOfVideos = fs.readdirSync(preEdittedFilePath).length;
    const orginalPathToArr = event.split("/");

    const completeRenamedFile = getNewFileName(
      orginalPathToArr,
      numberOfVideos
    );

    fs.rename(event, completeRenamedFile, function (err) {
      if (err) console.log("ERROR: " + err);
    });
  });
