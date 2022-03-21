const fs = require("fs");

const fileToCollection = async (absoluteVideoPath, video) => {
  const collectionPath = process.env.PATH_ANKI_MEDIA_COLLECTION + "/" + video;
  return await new Promise((resolve, reject) => {
    fs.copyFile(absoluteVideoPath, collectionPath, (err) => {
      if (err) {
        console.log("Error Found with: ", video, err);
        reject("Error Found with: ", video, err);
      } else {
        console.log("\nFile Contents of copied_file to collection:", video);
        resolve();
      }
    });
  });
};

module.exports = {
  fileToCollection,
};
