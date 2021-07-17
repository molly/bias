export default function pluralize(str, isPlural) {
  return isPlural ? `${str}s` : str;
}
