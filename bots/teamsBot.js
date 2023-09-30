const { CardFactory } = require('botbuilder');
const { FormInputs } = require('../models/formSample');
const { DialogBot } = require('./dialogBot');

class TeamsBot extends DialogBot {
    /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {Dialog} dialog
   */
    constructor(conversationState, userState, dialog) {
        super(conversationState, userState, dialog);

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        "Welcome to TeamsBot. Type anything to get logged in. Type 'logout' to sign-out."
                    );
                }
            }

            await next();
        });
    }

    async handleTeamsSigninVerifyState(context, query) {
        console.log(
            'Running dialog with signin/verifystate from an Invoke Activity.'
        );
        await this.dialog.run(context, this.dialogState);
    }

    async handleTeamsSigninTokenExchange(context, query) {
        console.log(
            'Running dialog with signin/tokenExchange from an Invoke Activity.'
        );
        await this.dialog.run(context, this.dialogState);
    }

    createAdaptiveCardAttachment() {
        return CardFactory.adaptiveCard({
            version: '1.0.0',
            type: 'AdaptiveCard',
            body: [
                {
                    type: 'TextBlock',
                    text: 'Enter Text Here'
                },
                {
                    type: 'Input.Text',
                    id: 'userInput',
                    placeholder: 'add some text and submit',
                    IsMultiline: true
                }
            ],
            actions: [
                {
                    type: 'Action.Submit',
                    title: 'Submit'
                }
            ]
        });
    }

    createFormAttachment() {
        return CardFactory.adaptiveCard({
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.5',
            body: [
                {
                    type: 'TextBlock',
                    size: 'medium',
                    weight: 'bolder',
                    text: FormInputs.ParticipantInfoForm.title,
                    horizontalAlignment: 'center',
                    wrap: true,
                    style: 'heading'
                },
                {
                    type: 'Input.Text',
                    label: 'Name',
                    style: 'text',
                    id: 'SimpleVal',
                    isRequired: true,
                    errorMessage: 'Name is required',
                    placeholder: 'Enter your name'
                },
                {
                    type: 'Input.Text',
                    label: 'Email',
                    style: 'email',
                    id: 'EmailVal',
                    placeholder: 'Enter your email'
                },
                {
                    type: 'Input.Text',
                    label: 'Comments',
                    style: 'text',
                    isMultiline: true,
                    id: 'MultiLineVal',
                    placeholder: 'Enter any comments'
                },
                {
                    type: 'Input.Number',
                    label: 'Quantity (Minimum -5, Maximum 5)',
                    min: -5,
                    max: 5,
                    value: 1,
                    id: 'NumVal',
                    errorMessage: 'The quantity must be between -5 and 5'
                },
                {
                    type: 'Input.Date',
                    label: 'Due Date',
                    id: 'DateVal',
                    value: '2017-09-20'
                },
                {
                    type: 'Input.Time',
                    label: 'Start time',
                    id: 'TimeVal',
                    value: '16:59'
                },
                {
                    type: 'TextBlock',
                    size: 'medium',
                    weight: 'bolder',
                    text: FormInputs.Survey.title,
                    horizontalAlignment: 'center',
                    wrap: true,
                    style: 'heading'
                },
                {
                    type: 'Input.ChoiceSet',
                    id: 'CompactSelectVal',
                    label: FormInputs.Survey.questions[0].question,
                    style: 'compact',
                    value: '1',
                    choices: [
                        {
                            title: 'Red',
                            value: '1'
                        },
                        {
                            title: 'Green',
                            value: '2'
                        },
                        {
                            title: 'Blue',
                            value: '3'
                        }
                    ]
                },
                {
                    type: 'Input.ChoiceSet',
                    id: 'SingleSelectVal',
                    label: FormInputs.Survey.questions[1].question,
                    style: 'expanded',
                    value: '1',
                    choices: [
                        {
                            title: 'Red',
                            value: '1'
                        },
                        {
                            title: 'Green',
                            value: '2'
                        },
                        {
                            title: 'Blue',
                            value: '3'
                        }
                    ]
                },
                {
                    type: 'Input.ChoiceSet',
                    id: 'MultiSelectVal',
                    label: FormInputs.Survey.questions[2].question,
                    isMultiSelect: true,
                    value: '1,3',
                    choices: [
                        {
                            title: 'Red',
                            value: '1'
                        },
                        {
                            title: 'Green',
                            value: '2'
                        },
                        {
                            title: 'Blue',
                            value: '3'
                        }
                    ]
                },
                {
                    type: 'TextBlock',
                    size: 'medium',
                    weight: 'bolder',
                    text: 'Input.Toggle',
                    horizontalAlignment: 'center',
                    wrap: true,
                    style: 'heading'
                },
                {
                    type: 'Input.Toggle',
                    label: 'Please accept the terms and conditions:',
                    title: FormInputs.Survey.questions[3].question,
                    valueOn: 'true',
                    valueOff: 'false',
                    id: 'AcceptsTerms',
                    isRequired: true,
                    errorMessage: 'Accepting the terms and conditions is required'
                },
                {
                    type: 'Input.Toggle',
                    label: 'How do you feel about red cars?',
                    title: FormInputs.Survey.questions[4].question,
                    valueOn: 'RedCars',
                    valueOff: 'NotRedCars',
                    id: 'ColorPreference'
                }
            ],
            actions: [
                {
                    type: 'Action.Submit',
                    title: 'Submit',
                    data: {
                        id: '1234567890'
                    }
                },
                {
                    type: 'Action.ShowCard',
                    title: 'Show Card',
                    card: {
                        type: 'AdaptiveCard',
                        body: [
                            {
                                type: 'Input.Text',
                                label: 'Enter comment',
                                style: 'text',
                                id: 'CommentVal'
                            }
                        ],
                        actions: [
                            {
                                type: 'Action.Submit',
                                title: 'OK'
                            }
                        ]
                    }
                }
            ]
        });
    }
}

module.exports.TeamsBot = TeamsBot;
