const ffmpeg = require("ffmpeg");

const compressFile = async (event, absoluteFilePath) => {
  console.log("compressing file: ", event);
  return await new Promise((resolve, reject) => {
    try {
      const process = new ffmpeg(event);
      process.then(
        function (video) {
          video
            .setVideoSize("640x480", true, false)
            .save(absoluteFilePath, function (error, file) {
              console.log("pre-savin!");
              if (!error) {
                console.log("Video file (compressFile): " + file);
                resolve();
              } else {
                console.log("Error saving (compressFile): " + error);
                reject();
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
