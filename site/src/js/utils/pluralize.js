export default function pluralize(str, num) {
  return num === 1 ? str : `${str}s`;
}
