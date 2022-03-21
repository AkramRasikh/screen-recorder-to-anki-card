const fs = require("fs");

const renameFile = async (fileToRename, fileRenameDestination) => {
  return await new Promise((resolve, reject) => {
    fs.rename(fileToRename, fileRenameDestination, function (err) {
      if (err) {
        console.log("ERROR (renameFile): " + err);
        reject();
      } else {
        console.log("success (renameFile): ", fileRenameDestination);
        resolve(fileRenameDestination);
      }
    });
  });
};

module.exports = {
  renameFile,
};
