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

// use the questionnaire data to create lable and input elements
const createElement = (data, element) => {
  console.log('this is data in createElement()', data);
  console.log('this is element', element);
  if (element === 'label') {
    const label = document.createElement('label');
    label.for = data.linkId;
    label.textContent = data.text;
    return label;
  } else if (element === 'input') {
    const input = document.createElement('input');
    input.id = data.linkId;
    console.log('this is the id:', data.linkId);
    input.dataset.text = data.text;
    input.placeholder = `add ${data.linkId} here`;
    input.name = data.linkId;
    input.value = '';
    input.type = 'text';
    input.autocomplete = 'off';
    return input;
  }
};

// render the questionnaire from the json
const renderQuestionnaire = (json) => {
  const questionnaireForm = document.querySelector('#questionnaireForm');
  const inputsData = json.questionnaire.item[0].item;

  inputsData.forEach((inputData) => {
    // create a label and input for each item
    const label = createElement(inputData, 'label');
    const input = createElement(inputData, 'input');
    questionnaireForm.appendChild(label);
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
