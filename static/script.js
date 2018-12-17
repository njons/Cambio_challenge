// get the questionnaire json on load
window.addEventListener('load', (event) => {
  xhrRequest('POST', '/api/execute', (error, json) => {
    if (error) {
      new Error();
    }
    renderQuestionnaire(json);
  });
});

// use the questionnaire data to create lable and input elements
const createElement = (data, element) => {
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
  questionnaireName.textContent = `Assess ${json.questionnaire.id}`;

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
  const responseArr = [];
  let item = {};

  // iterate through the inputs and use the information in the attributes to
  // populate the questionnaireResponse with the relevant info
  inputs.forEach((input) => {
    const inputValue = input.value;
    if (inputValue === '') {
      console.log('empty input');
    }
    // dynamically generate items for each of the questions in the questionnaire
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

  // get the questionnare object to be able to dynamically add in the information
  // to all of the questionnaireResponse
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
            // dynamically generate the number of items specified in the questionnaire
            item: createItemArr()
          }
        ]
      }
    };

    // post the response data to the endpoint to do the bmi calculation
    xhrRequestData(method, url, questionnaireResponse, (err, bmiData) => {
      if (err) {
        new Error();
      }
      // manipulate the dom upon recepit of the calculated data
      const result = document.querySelector('.result');
      const textDiv = document.querySelector('#result__text');
      const valueDiv = document.querySelector('#result__value');
      // if the resulting calculation is a number and the BMI is lower than 80
      if (typeof bmiData.assessment.valueQuantity.value === 'number' && bmiData.assessment.valueQuantity.value <= 80) {
        result.style.visibility = 'visible';
        textDiv.textContent = bmiData.assessment.interpretation.text;
        textDiv.style.color = 'white';
        textDiv.style.backgroundColor = 'darkblue';
        valueDiv.style.visibility = 'visible';
        valueDiv.innerHTML = `the BMI is <span>${bmiData.assessment.valueQuantity.value}</span> ${
          bmiData.assessment.valueQuantity.unit
        }`;
        result.appendChild(textDiv);
        result.appendChild(valueDiv);
        // if the resulting calculation is over 80
      } else if (bmiData.assessment.valueQuantity.value > 81) {
        textDiv.textContent = bmiData.assessment.interpretation.text;
        valueDiv.style.visibility = 'visible';
        valueDiv.textContent = 'the BMI is above 80 kg/m2';
        // if the resulting calculation is null (empty or non-number input)
      } else {
        result.style.visibility = 'visible';
        textDiv.textContent = 'try adding numbers';
        textDiv.style.color = 'tomato';
        textDiv.style.backgroundColor = 'transparent';
        valueDiv.style.visibility = 'hidden';
      }
    });
  });
});

// API call: posting data to the endoint
const xhrRequestData = (method, url, data, cb) => {
  const xhr = new XMLHttpRequest(url, cb);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      return cb(null, JSON.parse(xhr.responseText));
    } else if (xhr.readyState === 4 && xhr.status != 200) {
      console.log('sorry something went wrong');
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
      console.log('sorry something went wrong');
    }
  };
  xhr.open(method, url, true);
  xhr.send();
};
