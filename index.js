const dotenv = require('dotenv');
const fs = require('fs');
const { getNumberOfRelevantFiles } = require('./media-collections');
const { compressFile } = require('./compress-file');
const { fileToCollection } = require('./files-to-anki-collection');
const { renameFile } = require('./rename-file');
const { deleteFile } = require('./delete-file');

dotenv.config();

const videoFolderName =
  process.env.npm_config_initial_folder || 'Diners-s02-e10';
const folderRegex = process.env.npm_config_folder_regex || 'Diners-s02-e10';

if (!videoFolderName || !folderRegex) {
  throw 'Provide folder name & regex';
}

const preEdittedFilePath =
  process.env.DESKTOP_PATH + '/' + `${videoFolderName}`;

const getNewFileName = (orginalPathToFileArr, numberOfVideos) => {
  const newPath = orginalPathToFileArr
    .splice(0, orginalPathToFileArr.length - 1)
    .join('/');
  const newVideoIndex =
    numberOfVideos < 10 ? '0' + numberOfVideos : numberOfVideos;
  const newFilename =
    folderRegex + '-' + newVideoIndex + '-compressed' + '.webm';

  const removeRenamedPath = `${newPath}/${newFilename}`;
  return [removeRenamedPath, newFilename];
};

fs.watch(preEdittedFilePath, async (_, fileName) => {
  const filePathToThis = preEdittedFilePath + '/' + fileName;
  const fileExists = await fs.existsSync(filePathToThis);

  if (!fileExists) {
    return console.log(
      'Blocking recursively called file change/rename function',
    );
  }
  if (
    fileName.includes('.DS_Store') ||
    fileName.includes('pre-compress-screen') ||
    fileName.includes('compressed')
  ) {
    return console.log('Bloddy .DS sting Or pre-compress-secreen');
  }

  const newFilePath =
    preEdittedFilePath +
    '/' +
    fileName
      .replace(' ', '')
      .replace('(', '')
      .replace(')', '')
      .replace('screen', 'pre-compress-screen');

  const videosInCollection = fs.readdirSync(
    process.env.PATH_ANKI_MEDIA_COLLECTION,
  );
  const numberOfRelevantFiles = getNumberOfRelevantFiles(
    folderRegex,
    videosInCollection,
  );

  const renameIndex = Number(numberOfRelevantFiles)
    ? Number(numberOfRelevantFiles) + 1
    : 1;

  console.log('numberOfRelevantFiles: ', numberOfRelevantFiles);

  const orginalPathToFileArr = preEdittedFilePath + '/' + fileName;
  const orginalPathToFileArrSplit = orginalPathToFileArr.split('/');
  const [completeRenamedFilePath, newFilename] = getNewFileName(
    orginalPathToFileArrSplit,
    renameIndex,
  );

  try {
    const renamedFile = await renameFile(filePathToThis, newFilePath);
    await compressFile(renamedFile, completeRenamedFilePath);
    await fileToCollection(completeRenamedFilePath, newFilename);
    await deleteFile(renamedFile);
  } catch (error) {
    console.log('error: ', error);
  }
  return console.log('finished!');
});
