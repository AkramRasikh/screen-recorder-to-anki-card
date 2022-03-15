const dotenv = require("dotenv");
const fs = require("fs");
const chokidar = require("chokidar");
const videos = fs.readdirSync("./old-videos");
const ffmpeg = require("ffmpeg");

// const watcher = chokidar.watch('file, dir, glob, or array', {
//   ignored: /(^|[\/\\])\../, // ignore dotfiles
//   persistent: true
// });

dotenv.config();

const filenamePrefix = "Diners-s02-e01";
const preEdittedPath = process.env.DESKTOP_PATH + "/pre-" + `${filenamePrefix}`;
const postEdittedPath = process.env.DESKTOP_PATH + "/" + `${filenamePrefix}`;

const getNewFileName = (orginalPathToArr, numberOfVideos) => {
  const newPath = orginalPathToArr
    .splice(0, orginalPathToArr.length - 1)
    .join("/");
  const newVideoIndex =
    numberOfVideos < 10 ? "0" + numberOfVideos : numberOfVideos;
  console.log("newVideoIndex: ", newVideoIndex);
  const newFilename = filenamePrefix + "-" + newVideoIndex + ".webm";
  return `${newPath}/${newFilename}`;
};

chokidar
  .watch(preEdittedPath, { ignoreInitial: true })
  .on("add", (event, _) => {
    const numberOfVideos = fs.readdirSync(preEdittedPath).length;
    const orginalPathToArr = event.split("/");

    const completeRenamedFile = getNewFileName(
      orginalPathToArr,
      numberOfVideos
    );

    fs.rename(event, completeRenamedFile, function (err) {
      if (err) console.log("ERROR: " + err);
    });
  });

// video.setVideoSize('640x?', true, true, '#fff')

// videos.forEach((videoPath) => {
//   try {
//     const process = new ffmpeg(`./old-videos/${videoPath}`);
//     process.then(
//       function (video) {
//         video
//           .setVideoSize("640x480", true, false)
//           .save(`./new-videos/${videoPath}`, function (error, file) {
//             if (!error) console.log("Video file: " + file);
//           });
//       },
//       function (err) {
//         console.log("Error: " + err);
//       }
//     );
//   } catch (e) {
//     console.log(e.code);
//     console.log(e.msg);
//   }
// });
// ffmpeg -i /Users/akramrasikh/Desktop/episode-10/$name -vf scale=720:-1 /Users/akramrasikh/Desktop/post-editted/$name
