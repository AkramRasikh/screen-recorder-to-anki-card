const dotenv = require("dotenv");
const ffmpeg = require("ffmpeg");
const fs = require("fs");

dotenv.config();

const videoFolderName = process.env.npm_config_initial_folder;
const preEdittedFilePath =
  process.env.DESKTOP_PATH + "/pre-" + `${videoFolderName}`;
const postEdittedFilePath =
  process.env.DESKTOP_PATH + "/post-" + `${videoFolderName}`;

console.log("postEdittedFilePath ", postEdittedFilePath);
if (!fs.existsSync(postEdittedFilePath)) {
  fs.mkdirSync(postEdittedFilePath);
}
const videos = fs.readdirSync(preEdittedFilePath);

const filteredVideos = videos.filter((video) => video !== ".DS_Store");
console.log("videos: ", videos);
console.log("filteredVideos: ", filteredVideos);
filteredVideos.forEach((videoPath) => {
  const absoluteFilePath = preEdittedFilePath + "/" + videoPath;
  try {
    const process = new ffmpeg(absoluteFilePath);
    process.then(
      function (video) {
        video
          .setVideoSize("640x480", true, false)
          .save(`${postEdittedFilePath}/${videoPath}`, function (error, file) {
            if (!error) console.log("Video file: " + file);
          });
      },
      function (err) {
        console.log("Error: " + err);
      }
    );
  } catch (e) {
    console.log(e.code);
    console.log(e.msg);
  }
});
