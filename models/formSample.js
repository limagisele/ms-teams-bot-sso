const { CardFactory } = require('botbuilder');

const formInputs = {
    ParticipantInfoForm: {
        title: 'Input.Text elements'
    },
    Survey: {
        title: 'Input ChoiceSet',
        questions: [
            {
                question: 'What color do you want? (compact)',
                items: [
                    {
                        choice: 'Red',
                        value: '1'
                    },
                    {
                        choice: 'Green',
                        value: '2'
                    },
                    {
                        choice: 'Blue',
                        value: '3'
                    }
                ]
            },
            {
                question: 'What color do you want? (expanded)',
                items: [
                    {
                        choice: 'Red',
                        value: '1'
                    },
                    {
                        choice: 'Green',
                        value: '2'
                    },
                    {
                        choice: 'Blue',
                        value: '3'
                    }
                ]
            },
            {
                question: 'What color do you want? (multiselect)',
                items: [
                    {
                        choice: 'Red',
                        value: '1'
                    },
                    {
                        choice: 'Green',
                        value: '2'
                    },
                    {
                        choice: 'Blue',
                        value: '3'
                    }
                ]
            },
            {
                question: 'I accept the terms and conditions (True/False)'
            },
            {
                question: 'Red cars are better than other cars'
            }
        ]
    }
};

function createFormAttachment() {
    return CardFactory.adaptiveCard({
        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.5',
        body: [
            {
                type: 'TextBlock',
                size: 'medium',
                weight: 'bolder',
                text: formInputs.ParticipantInfoForm.title,
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
                text: formInputs.Survey.title,
                horizontalAlignment: 'center',
                wrap: true,
                style: 'heading'
            },
            {
                type: 'Input.ChoiceSet',
                id: 'CompactSelectVal',
                label: formInputs.Survey.questions[0].question,
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
                label: formInputs.Survey.questions[1].question,
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
                label: formInputs.Survey.questions[2].question,
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
                title: formInputs.Survey.questions[3].question,
                valueOn: 'true',
                valueOff: 'false',
                id: 'AcceptsTerms',
                isRequired: true,
                errorMessage: 'Accepting the terms and conditions is required'
            },
            {
                type: 'Input.Toggle',
                label: 'How do you feel about red cars?',
                title: formInputs.Survey.questions[4].question,
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

module.exports.createFormAttachment = createFormAttachment;
