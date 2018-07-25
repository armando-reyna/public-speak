import axios from 'axios';

const env = JSON.parse(JSON.stringify (process.env)).NODE_ENV || 'local';

const http = (() => {  
  let baseURL;
  if (env !== 'production') {
    baseURL = 'http://35.229.104.234/v1/api/';
  } else {
    baseURL = 'http://35.229.104.234/v1/api/';
  }
  return axios.create({
    baseURL,
  });
})();
http.interceptors.request.use((config) => {
  // console.log('REQUEST CONFIG', config);
  return config;
}, function (error) {
  console.log('REQUEST ERROR', { error });
  return Promise.reject(error);
});
http.interceptors.response.use((response) => {
  // console.log('RESPONSE DATA', response);
  return response;
}, function (error) {
  if (!error.response || typeof error.response.data !== 'object') {
      error = {
          response: {
              data: {
                  message: error.message
              }
          }
      }
  }
  console.log('RESPONSE ERROR', { error });
  return Promise.reject(error);
});
export default http;
