const surveyConfig = {
  1: {
    2: {
      responseContent:
        "Great\n\nSection 1 of 7: About you\n\n1A) What stage of the Fat Macy’s programme are you at?\n\nREPLY With the Right number.\n\n1: Completing my trial period\n\n2: Completing my 200 hours of work experience\n\n3: I have completed 200 hours of work experience but not yet used my Move On Grant\n\n4: I used my Move On Grant less than 6 months ago\n\n5:I used my Move On Grant between 6 months and 2 years ago",
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
    1: {
      responseContent: {
        templateVariables:
          "Great thank you.\n\nSection 2 of 7: Workplace training\n\nWhen answering these questions, think about the training hours you’ve completed in the restaurant or at events at other venues.\n\n2A) Have you completed any training with Fat Macy’s since March 2024?\n\nThis could include your trial sessions or any other sessions contributing to your 200 hours.  This can be at Sohaila, at events, or at the Lexington cafe",
      },
      responseType: "template",
      templateKey: "survey_2a",
    },
    2: {
      responseContent: {
        templateVariables:
          "2B) How would you rate the work experience and training part of the Fat Macy's Milestone Programme?",
      },
      responseType: "template",
      templateKey: "survey_2b",
    },
    3: {
      responseContent:
        "2C) Please complete this sentence using a voice note or text message:\n\n'When I think about my training hours with Fat Macy's, I feel...'",
      responseType: "text",
      templateKey: null,
    },
    4: {
      responseContent:
        "2D) Thank you for sharing. We often have sessions on the rota which we cannot fill. How could Fat Macy’s support you to complete more hours?\n\nPlease answer using a voice note or text message",
      responseType: "text",
      templateKey: null,
    },
  },
  3: {
    1: {
      responseContent: {
        templateVariables:
          "Thanks for sharing your thoughts!\n\nSection 3 of 6: The Lexington\n\n3A) Have you completed any training sessions with the Lexington?",
      },
      responseType: "template",
      templateKey: "survey_2a", //3A is same as 2A no need for new template here
    },
    2: {
      responseContent: {
        templateVariables:
          "3B) How would you rate the training you have received from the Lexington team?",
      },
      responseType: "template",
      templateKey: "survey_2b",
    },
    3: {
      responseContent: {
        templateVariables:
          "3C) How would you rate your experience of communicating and working with the Lexington team generally?",
      },
      responseType: "template",
      templateKey: "survey_2b",
    },
    4: {
      responseContent:
        "3D) Please complete this sentence using a voice note or text message:\n\n'When I think about my sessions with Lexington, I feel...'",
      responseType: "text",
      templateKey: null,
    },
  },
};

module.exports = {
  surveyConfig,
};
