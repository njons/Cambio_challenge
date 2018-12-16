# Test assignment: Help a clinician to calculate BMI

When working with CDS, while the patient records contains a lot of patient information, we often need to ask a clinician for additional information about a patient. Your task will be to render questions to assess a patient's BMI, send responses to an endpoint and then render an assessment back to the clinician.

You have been provided with a small server that will serve static files from _./static_ and also provides an HTTP endpoint _POST /api/execute_.

The end point is used to get a JSON structure containing a _questionnaire_ definition, your job is to create and send a _questionnaireResponse_ structure with the users input, and then render the resulting _assessment_.

In this assignment you will work with models defined in a standard called [FHIR](http://hl7.org/fhir/), it is an extensive standard for structuring clinical data but you will be provided links through out this assignment to only the relevant sections to reduce the scope.

A [FHIR Questionnaire](https://www.hl7.org/fhir/questionnaire.html#resource) is a structure that describes which questions that should be asked to the clinician, the UI should then generate a [FHIR QuestionnaireResponse](https://www.hl7.org/fhir/questionnaireresponse.html#resource) and send that back to _POST /api/execute_. That call will then return a [FHIR Observation](https://www.hl7.org/fhir/observation.html#resource) that should be rendered to inform the user about the assessment.

When reviewing your solution we will look at the structure and readability of your code.

## Requirements

- The information in the UI needs to stay relevant at all times.
- Error handling; if a XHR fails or gives invalid structures the user needs to be informed.
- Use CSS to style the elements in a user friendly way.
- The code that renders the questionnaire _must_ be written in a way that could render any questionnaire structure with the item types _decimal_ and _group_.
- The questionnaire should not have a “submit” button, but each time an input is changed a new call to _POST /api/execution_ must be made.

If you get stuck on any of the requirements, send us a question via email.

## Implementation notes

- Write the code in ECMAScript 6 or higher, we encourage use of the newest JavaScript/ECMAScript language features.
- The only browser needs compatibility with is Chromium/Chrome 71+.
- The code should be written without any UI frameworks (e.g. no React, Angular, Polymer, jQuery).

## Delivery

The final project shall be accessible through a git repository for download. The deadline for delivering the assignment will be communicated elsewhere. A demonstration of the implemented solution will take place during the week after the delivery together with the whole team.
Clear instructions on how to set up and run the service need to be provided.

The code together with the demonstration will provide the interviewers with an understanding of the applicant's coding style and design choices.

## Start the Server

    $ npm install
    $ node server.js
