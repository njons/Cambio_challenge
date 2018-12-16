console.log('this is script.js');

// get the questionnaire json on load
window.addEventListener('load', (event) => {
  console.log('I loaded');
  xhrRequest('POST', '/api/execute', (error, json) => {
    if (error) {
      new Error();
    }
    console.log('this is json:', json);
  });
});

// API call: requesting the questionnaire
const xhrRequest = (method, url, cb) => {
  const xhr = new XMLHttpRequest(url, cb);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      return cb(null, JSON.parse(xhr.responseText));
    } else if (xhr.readyState === 4 && xhr.status != 200) {
      return 'sorry something went wrong';
    }
  };
  xhr.open(method, url, true);
  xhr.send();
};
