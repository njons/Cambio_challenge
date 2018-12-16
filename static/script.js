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

// dynamically generate the number of items that require input in the
// questionnaireResponse based on the corresponing items in the questionnaire
const createItemArr = () => {
  const inputs = document.querySelectorAll('input');
  console.log('you have reached createItemArr():');
  console.log('this is inputs in createItemArr():', inputs);
};

// dynamically generates a questionnaireResponse based on user input
window.addEventListener('keyup', (event) => {
  const url = '/api/execute';
  const method = 'POST';
  // const data = {
  //   questionnaireResponse: {
  //     resourceType: 'QuestionnaireResponse',
  //     questionnaire: {
  //       id: 'bmi'
  //     },
  //     item: [
  //       {
  //         linkId: 'heightWeight',
  //         type: 'group',
  //         item: [
  //           {
  //             linkId: 'weight',
  //             text: 'Weight(kg)',
  //             valueDecimal: '65'
  //           },
  //           {
  //             linkId: 'height',
  //             text: 'Height (cm)',
  //             valueDecimal: '170'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // };

  const questionnaireResponse = {
    questionnaireResponse: {
      resourceType: 'QuestionnaireResponse',
      questionnaire: {
        id: 'bmi'
      },
      item: [
        {
          linkId: 'heightWeight',
          type: 'group',
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
