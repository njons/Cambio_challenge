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
  const questionnaireName = document.querySelector('#questionnaireName');
  const inputsData = json.questionnaire.item[0].item;

  // set the name of the questionnare
  questionnaireName.textContent = `${json.questionnaire.id} ${json.questionnaire.resourceType}`;

  inputsData.forEach((inputData) => {
    // create a label and input for each item
    const label = createElement(inputData, 'label');
    const input = createElement(inputData, 'input');
    questionnaireForm.appendChild(label);
    questionnaireForm.appendChild(input);
  });
};

// dynamically generate the number of items that require input in the
// questionnaireResponse based on the corresponing items in the questionnaire
const createItemArr = () => {
  const inputs = document.querySelectorAll('input');
  console.log('you have reached createItemArr():');
  console.log('this is inputs in createItemArr():', inputs);
  const responseArr = [];
  let item = {};
  inputs.forEach((input, i) => {
    const inputValue = input.value;
    console.log('this is the input value:', inputValue);
    console.log('this is the input:', input);
    console.log('this is i', i);

    item = {
      linkId: input.id,
      text: input.dataset.text,
      valueDecimal: input.value
    };
    responseArr.push(item);
  });
  return responseArr;
};

// dynamically generates a questionnaireResponse based on user input
window.addEventListener('keyup', (event) => {
  const url = '/api/execute';
  const method = 'POST';

  xhrRequest(method, url, (error, json) => {
    if (error) {
      new Error();
    }
    const questionnaireResponse = {
      questionnaireResponse: {
        resourceType: 'QuestionnaireResponse',
        questionnaire: {
          id: `${json.questionnaire.id}`
        },
        item: [
          {
            linkId: `${json.questionnaire.item[0].linkId}`,
            type: `${json.questionnaire.item[0].typ}`,
            item: createItemArr()
          }
        ]
      }
    };

    xhrRequestData(method, url, questionnaireResponse, (err, bmiData) => {
      if (err) {
        new Error();
      }
      console.log('this is the calculated bmiData:', bmiData);
      const result = document.querySelector('.result');
      const textDiv = document.querySelector('#result__text');
      const valueDiv = document.querySelector('#result__value');
      const resultsH2 = document.querySelector('#result__header');
      if (bmiData.assessment.valueQuantity.value > 0 && bmiData.assessment.valueQuantity.value <= 80) {
        resultsH2.style.visibility = 'visible';
        textDiv.textContent = bmiData.assessment.interpretation.text;
        valueDiv.innerHTML = `the BMI is <span>${bmiData.assessment.valueQuantity.value}</span> ${
          bmiData.assessment.valueQuantity.unit
        }`;

        result.appendChild(textDiv);
        result.appendChild(valueDiv);
      } else if (bmiData.assessment.valueQuantity.value > 81) {
        textDiv.textContent = bmiData.assessment.interpretation.text;
        valueDiv.textContent = 'the BMI is above 80';
      }
    });
  });
});

// API call: posting the data to the endoint
const xhrRequestData = (method, url, data, cb) => {
  console.log('you are requesting data');
  console.log('this is the url in the request:', url);
  console.log('this is the obj in the request:', data);
  // const data = JSON.stringify(obj);
  // console.log('this is the json data in the request:', data);
  const xhr = new XMLHttpRequest(url, cb);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      return cb(null, JSON.parse(xhr.responseText));
    } else if (xhr.readyState === 4 && xhr.status != 200) {
      return 'sorry something went wrong';
    }
  };
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
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
