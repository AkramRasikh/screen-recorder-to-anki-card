const fs = require("fs");

const fileToCollection = (absoluteVideoPath, video) => {
  const collectionPath = process.env.PATH_ANKI_MEDIA_COLLECTION + "/" + video;
  fs.copyFile(absoluteVideoPath, collectionPath, (err) => {
    if (err) {
      console.log("Error Found with: ", video, err);
    } else {
      console.log("\nFile Contents of copied_file:", video);
    }
  });
};

module.exports = {
  fileToCollection,
};
