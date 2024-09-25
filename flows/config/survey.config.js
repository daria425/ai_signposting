const surveyConfig = {
  1: {
    2: {
      responseContent:
        "Great\n\nSection 1 of 6: About you\n\n1A) What stage of the Fat Macy’s programme are you at?\n\nREPLY With the Right number.\n\n1: Completing my trial period\n\n2: Completing my 200 hours of work experience\n\n3: I have completed 200 hours of work experience but not yet used my Move On Grant\n\n4: I used my Move On Grant less than 6 months ago",
      responseType: "text",
      templateKey: null,
    },
    3: {
      responseContent: {
        templateVariables: "1B) Are you happy for us to record your name?",
      },
      responseType: "template",
      templateKey: "survey_1b",
    },
    4: {
      responseContent: {
        templateVariables:
          "1C) Are you happy for us to ask about your answers on this form?",
      },
      responseType: "template",
      templateKey: "survey_1c",
    },
  },
  2: {
    5: {
      responseContent: {
        templateVariables:
          "Great\n\nSection 2 of 6: Workplace training\n\nWhen answering these questions, think about the training hours you’ve completed in the restaurant or at events at other venues.\n\n2A) Have you completed any training with Fat Macy’s in the past 6 months?\n\nThis could include your trial session, or at Sohaila, events or at the Lexington cafe",
      },
      responseType: "template",
      templateKey: "survey_2a",
    },
  },
};

module.exports = {
  surveyConfig,
};
