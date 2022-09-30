const existsInMediaCollection = (file, collections) => {
  const fileInCollection = collections.includes(file);
  return fileInCollection;
};

const getNumberOfRelevantFiles = (regex, collections) => {
  const items = collections.filter((item) => item.includes(regex));
  const numberOfRelevantFile = items.map(
    (item) => item.split("-")[3].split(".")[0]
  )[items.length - 1];

  return numberOfRelevantFile;
};

module.exports = {
  existsInMediaCollection,
  getNumberOfRelevantFiles,
};
