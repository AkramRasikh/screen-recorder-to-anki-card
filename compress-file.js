const ffmpeg = require("ffmpeg");

const compressFile = async (event, absoluteFilePath) => {
  return await new Promise((resolve, reject) => {
    try {
      const process = new ffmpeg(event);
      process.then(
        function (video) {
          video
            .setVideoSize("640x480", true, false)
            .save(absoluteFilePath, function (error, file) {
              if (!error) {
                console.log("Video file (compressFile): " + file);
                resolve();
              }
            });
        },
        function (err) {
          console.log("Error (compressFile): " + err);
          reject();
        }
      );
    } catch (e) {
      console.log(e.code);
      console.log(e.msg);
      reject();
    }
  });
};

module.exports = {
  compressFile,
};
