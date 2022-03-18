const fs = require("fs");

const deleteFile = async (file) => {
  return await new Promise((resolve, reject) => {
    fs.unlinkSync(file, (err) => {
      if (err) {
        console.log("Error (deleteFile): ", file);
        reject();
      } else {
        console.log("File deleted (deleteFile):", file);
        resolve();
      }
    });
  });
};

module.exports = {
  deleteFile,
};
