const existsInMediaCollection = (file, collections) => {
  const fileInCollection = collections.includes(file);
  return fileInCollection;
};

const getNumberOfRelevantFiles = (regex, collections) => {
  const numberOfRelevantFiles = collections.filter((item) =>
    item.includes(regex)
  );
  return numberOfRelevantFiles.length;
};

module.exports = {
  existsInMediaCollection,
  getNumberOfRelevantFiles,
};
