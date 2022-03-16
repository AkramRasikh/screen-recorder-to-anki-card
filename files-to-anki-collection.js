const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const videoFolderName =
  process.env.npm_config_initial_folder || "post-Diners-s01-e10";

if (!videoFolderName) {
  throw "Add a folder flag!!!!";
}

const initialFolderPath = process.env.DESKTOP_PATH + "/" + videoFolderName;

const videosInCollection = fs.readdirSync(
  process.env.PATH_ANKI_MEDIA_COLLECTION
);
const initialFolderPathFiles = fs
  .readdirSync(initialFolderPath)
  .filter((file) => file !== ".DS_Store" && !videosInCollection.includes(file));

if (!!initialFolderPathFiles && initialFolderPathFiles.length === 0) {
  throw "Nothing to send";
}

initialFolderPathFiles.forEach((video) => {
  const absoluteVideoPath = initialFolderPath + "/" + video;
  const collectionPath = process.env.PATH_ANKI_MEDIA_COLLECTION + "/" + video;
  fs.copyFile(absoluteVideoPath, collectionPath, (err) => {
    if (err) {
      console.log("Error Found with: ", video, err);
    } else {
      console.log(
        "\nFile Contents of copied_file:",
        fs.readFileSync(collectionPath, "utf8")
      );
    }
  });
});
