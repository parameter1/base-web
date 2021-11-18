export default async ({ error } = {}) => {
  const statusCode = error.status || error.statusCode || 500;
  if (statusCode === 404) {

  }
};
