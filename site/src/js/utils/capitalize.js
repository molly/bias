export default (str) => {
  if (typeof str !== "string") {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};
