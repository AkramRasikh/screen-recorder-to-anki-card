const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const videoFolderName = process.env.npm_config_initial_folder;
const postEdittedFilePath =
  process.env.DESKTOP_PATH + "/post-" + `${videoFolderName}`;

const videos = fs.readdirSync(postEdittedFilePath);
const filteredVideos = videos.filter((video) => video !== ".DS_Store");

filteredVideos.forEach((videoPath) => {
  fs.copyFile(
    `${postEdittedFilePath}/${videoPath}`,
    `${process.env.PATH_ANKI_MEDIA_COLLECTION}/${videoPath}`,
    (err) => {
      if (err) throw err;
      console.log(
        `${postEdittedFilePath}/${videoPath} --> ${process.env.PATH_ANKI_MEDIA_COLLECTION}/${videoPath}`
      );
    }
  );
});
