export const navigate = (formData, targetPage, history) => {
  const queryString = Object.entries(formData)
    .filter(([_, v]) => !!v)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  history.push(`/${targetPage}?${queryString}`);
};
