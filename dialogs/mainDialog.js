const { ConfirmPrompt, DialogSet, DialogTurnStatus, OAuthPrompt, WaterfallDialog, Dialog, ComponentDialog } = require('botbuilder-dialogs');

const CONFIRM_PROMPT = 'ConfirmPrompt';
const MAIN_DIALOG = 'MainDialog';
const MAIN_WATERFALL_DIALOG = 'MainWaterfallDialog';
const OAUTH_PROMPT = 'OAuthPrompt';
const { SimpleGraphClient } = require('../simpleGraphClient');

const {
    CardFactory
} = require('botbuilder');
const { createFormAttachment } = require('../models/formSample');

class MainDialog extends ComponentDialog {
    constructor() {
        super(MAIN_DIALOG, process.env.connectionName);
        this.userInput = {};
        this.addDialog(
            new OAuthPrompt(OAUTH_PROMPT, {
                connectionName: process.env.connectionName,
                text: 'Please Sign In',
                title: 'Sign In',
                timeout: 300000
            })
        );
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(
            new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.promptStep.bind(this),
                this.loginStep.bind(this),
                this.ensureOAuth.bind(this),
                this.displayForm.bind(this),
                this.updateUserInput.bind(this),
                this.sendResults.bind(this)
            ])
        );

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.baseUrl = process.env.BaseUrl;
    }

    /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} dialogContext
   */
    async run(context, accessor) {
        console.log('running');
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async promptStep(stepContext) {
        try {
            console.log('prompt');
            await stepContext.context.sendActivity('Logging you in...');
            return await stepContext.beginDialog(OAUTH_PROMPT);
        } catch (err) {
            console.error(err);
        }
    }

    async loginStep(stepContext) {
    // Get the token from the previous step. Note that we could also have gotten the
    // token directly from the prompt itself. There is an example of this in the next method.
        console.log('login');
        const tokenResponse = stepContext.result;
        if (!tokenResponse || !tokenResponse.token) {
            await stepContext.context.sendActivity(
                'Login was not successful please try again.'
            );
        } else {
            const client = new SimpleGraphClient(tokenResponse.token);
            const me = await client.getMe();
            const title = me ? me.jobTitle : 'UnKnown';
            await stepContext.context.sendActivity(
                `You're logged in as ${ me.displayName } (${ me.userPrincipalName }); your job title is: ${ title }; your photo is: `
            );
            const photoBase64 = await client.GetPhotoAsync(tokenResponse.token);
            const card = CardFactory.thumbnailCard(
                '',
                CardFactory.images([photoBase64])
            );
            await stepContext.context.sendActivity({ attachments: [card] });
            return await stepContext.prompt(
                CONFIRM_PROMPT,
                'Would you like to update your skills?'
            );
        }
        return await stepContext.endDialog();
    }

    async ensureOAuth(stepContext) {
        await stepContext.context.sendActivity('Well done! Please fill form below.');
        if (stepContext.result) {
            // Call the prompt again because we need the token. The reasons for this are:
            // 1. If the user is already logged in we do not need to store the token locally in the bot and worry
            // about refreshing it. We can always just call the prompt again to get the token.
            // 2. We never know how long it will take a user to respond. By the time the
            // user responds the token may have expired. The user would then be prompted to login again.
            //
            // There is no reason to store the token locally in the bot because we can always just call
            // the OAuth prompt to get the token or get a new token if needed.
            return await stepContext.beginDialog(OAUTH_PROMPT);
        }
        return await stepContext.endDialog();
    }

    async displayForm(stepContext) {
        const tokenResponse = stepContext.result;
        if (tokenResponse && tokenResponse.token) {
            await stepContext.context.sendActivity({
                attachments: [createFormAttachment()]
            });
            return Dialog.EndOfTurn;
        }
        return await stepContext.endDialog();
    }

    async updateUserInput(stepContext) {
        const formInput = stepContext.context.activity.value;
        console.log(`User Input: ${ JSON.stringify(formInput) }`);
        this.userInput.data = formInput;
        return await stepContext.beginDialog(OAUTH_PROMPT);
    }

    async sendResults(stepContext) {
        const token = stepContext.result.token;
        console.log(`Token: ${ JSON.stringify(token) }`);
        this.userInput.token = token;
        console.log(this.userInput);
        await stepContext.context.sendActivity(
            'Thanks! Your skills have been updated!'
        );
        return await stepContext.endDialog();
    }
}

module.exports.MainDialog = MainDialog;
