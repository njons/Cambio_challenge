console.log('this is script.js');

// get the questionnaire json on load
window.addEventListener('load', (event) => {
  console.log('I loaded');
  xhrRequest('POST', '/api/execute', (error, json) => {
    if (error) {
      new Error();
    }
    renderQuestionnaire(json);
  });
});

// render the questionnaire from the json
const renderQuestionnaire = (json) => {
  const questionnaireForm = document.querySelector('#questionnaireForm');
  const inputsData = json.questionnaire.item[0].item;

  // iterate through the info requested in the json
  inputsData.forEach((inputData) => {
    console.log(inputData);
    // make an input for each questionnaire item
    const input = document.createElement('input');
    input.id = inputData.linkId;
    console.log('this is the id:', inputData.linkId);
    // append to form
    questionnaireForm.appendChild(input);
  });
};

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
