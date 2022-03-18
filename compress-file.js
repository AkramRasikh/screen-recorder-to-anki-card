const ffmpeg = require("ffmpeg");

const compressFile = (event, absoluteFilePath) => {
  try {
    const process = new ffmpeg(event);
    process.then(
      function (video) {
        video
          .setVideoSize("640x480", true, false)
          .save(absoluteFilePath, function (error, file) {
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
};

module.exports = {
  compressFile,
};
