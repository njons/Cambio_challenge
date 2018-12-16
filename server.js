const express = require('express');
const bodyParser = require('body-parser');
const {join} = require('path');
const Ajv = require('ajv');

const server = express();
const port = process.env.PORT || 8080;

server.use('/', express.static(join(__dirname, 'static')));
server.use(bodyParser.json());

server.post('/api/execute', (request, response) => {
  const inputValidator = getInputValidator();
  const valid = inputValidator(JSON.stringify(request.body));
  if (!valid) {
    response.status(400).json(inputValidator.errors);
    return;
  }

  const responseBody = {};

  responseBody.questionnaire = getQuestionnaire();
  // request.body = {
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

  console.log('this is request.body:', request.body);
  const questionnaireResponse = request.body.questionnaireResponse;
  if (questionnaireResponse) {
    responseBody.assessment = getObservationFromQuestionnaireResponse(questionnaireResponse);
  }

  response.json(responseBody);
});

server.listen(port, (listenError) => {
  if (listenError) {
    throw listenError;
  } else {
    console.log(`Server listening on http://localhost:${port}`);
  }
});

function getQuestionnaire() {
  return {
    resourceType: 'Questionnaire',
    id: 'bmi',
    item: [
      {
        linkId: 'heightWeight',
        type: 'group',
        item: [
          {
            linkId: 'height',
            type: 'decimal',
            text: 'Height (cm)'
          },
          {
            linkId: 'weight',
            type: 'decimal',
            text: 'Weight (kg)'
          }
        ]
      }
    ]
  };
}

const classifications = {
  'Very severely underweight': 0,
  'Severely underweight': 16,
  Underweight: 18.5,
  'Normal (healthy weight)': 25,
  Overweight: 30,
  'Obese Class I (Moderately obese)': 35,
  'Obese Class II (Severely obese)': 40,
  'Obese Class III (Very severely obese)': 45,
  'Obese Class IV (Morbidly Obese)': 50,
  'Obese Class V (Super Obese)': 60,
  'Obese Class VI (Hyper Obese)': Number.MAX_VALUE
};
function getClassification(bmi) {
  let result;

  for (const [label, labelMaximumBMI] of Object.entries(classifications)) {
    result = label;

    if (bmi <= labelMaximumBMI) {
      break;
    }
  }

  return result;
}

function getObservationFromQuestionnaireResponse(questionnaireResponse) {
  const heightWeight = questionnaireResponse.item.find((item) => item.linkId === 'heightWeight');
  const height = heightWeight.item.find((item) => item.linkId === 'height');
  const weight = heightWeight.item.find((item) => item.linkId === 'weight');
  console.log('this is height:', height);
  console.log('this is weight:', weight);
  const bmi = Math.round((weight.valueDecimal / Math.pow(height.valueDecimal / 100, 2)) * 100) / 100;

  return {
    resourceType: 'Observation',
    valueQuantity: {
      value: bmi,
      unit: 'kg/m2'
    },
    interpretation: {
      text: getClassification(bmi)
    }
  };
}

function getInputValidator() {
  const ajv = new Ajv({allErrors: true});
  return ajv.compile({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      questionnaireResponse: {
        type: 'object',
        required: ['id', 'resourceType', 'item'],
        properties: {
          id: {enum: ['bmi']},
          resourceType: {enum: ['QuestionnaireResponse']},
          item: {
            type: 'array',
            items: {
              oneOf: [
                {
                  type: 'object',
                  required: ['linkId', 'item'],
                  properties: {
                    linkId: {enum: ['heightWeight']},
                    item: {
                      type: 'array',
                      items: {
                        anyOf: [
                          {
                            type: 'object',
                            required: ['linkId', 'valueDecimal'],
                            properties: {
                              linkId: {enum: ['height']},
                              valueDecimal: {
                                type: 'number',
                                minimum: 50,
                                maximum: 300
                              }
                            }
                          },
                          {
                            type: 'object',
                            required: ['linkId', 'valueDecimal'],
                            properties: {
                              linkId: {enum: ['weight']},
                              valueDecimal: {
                                type: 'number',
                                minimum: 10,
                                maximum: 300
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  });
}
