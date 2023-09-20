const FormInputs = {
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

module.exports.FormInputs = FormInputs;
