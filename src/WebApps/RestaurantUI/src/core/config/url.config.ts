const isDev = import.meta.env.DEV;

const getRestaurantApiUrl = function () {
  let url = "";
  if (isDev) {
    url = "https://localhost:7111/gateway/";
  } else {
    url = "https://localhost:44341/api/";
  }
  return url;
};

const getAcontPlusApiUrl = function () {
  let url = "";
  if (isDev) {
    url = "http://205.209.99.71:8093/gateway/";
  } else {
    url = "http://205.209.99.71:8093/gateway/";
  }
  return url;
};

export { getAcontPlusApiUrl, getRestaurantApiUrl };
