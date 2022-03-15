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
// const ffmpeg = require("ffmpeg");
