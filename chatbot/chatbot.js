'use strict';

const dialogflow = require('dialogflow');
const structjson = require('./structjson.js');
const config = require('../config/keys');

const projectID = config.googleProjectID;
const sessionId = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey,
};

const sessionClient = new dialogflow.SessionsClient({projectID,credentials});


module.exports = {
    textQuery: async function(text, userID,  parameters = {}){
        let self = module.exports;
        const sessionPath = sessionClient.sessionPath(projectID, sessionId + userID);
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: text,
                languageCode: languageCode,
              },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
          };

        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },
    eventQuery: async function(event, userID, parameters = {}){
        let self = module.exports;
        let sessionPath = sessionClient.sessionPath(projectID, sessionId + userID);

        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                languageCode: languageCode,
              },
            }
          };
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },

    handleAction: function(responses){
        return responses;
    },
}