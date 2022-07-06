// Takes an array of objects and a field name and returns an array of unique values for that field
const findUniqueFields = (array, field) => {
  return array
    .map((item) => item[field])
    .filter((value, index, self) => self.indexOf(value) === index);
};

export default findUniqueFields;
