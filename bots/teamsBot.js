const { TurnContext, MessageFactory, TeamsInfo } = require('botbuilder');
const { DialogBot } = require('./dialogBot');
const ProactiveAppIntallationHelper = require('../models/ProactiveAppIntallationHelper');

class TeamsBot extends DialogBot {
    /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {Dialog} dialog
   */
    constructor(conversationState, userState, dialog, conversationReferences) {
        super(conversationState, userState, dialog);

        this.conversationReferences = conversationReferences;
        this.onConversationUpdate(async (context, next) => {
            this.addConversationReference(context.activity);

            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(
                        `Hi ${ membersAdded[cnt].name }. Welcome to TeamsBot. Type 'login' to get started.`
                    );
                }
            }

            await next();
        });

        this.onMessage(async (context, next) => {
            this.addConversationReference(context.activity);
            TurnContext.removeRecipientMention(context.activity);
            const text = context.activity.text?.trim().toLocaleLowerCase();
            if (text && text.includes('install')) {
                await this.InstallAppInTeamsAndChatMembersPersonalScope(context);
            } else if (text && text.includes('send')) {
                await this.SendNotificationToAllUsersAsync(context);
            }
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

    async InstallAppInTeamsAndChatMembersPersonalScope(context) {
        let NewAppInstallCount = 0;
        let ExistingAppInstallCount = 0;
        let result = '';
        const objProactiveAppIntallationHelper = new ProactiveAppIntallationHelper();
        const teamMembers = await TeamsInfo.getPagedMembers(context);
        const count = teamMembers.members.map(async (member) => {
            if (!this.conversationReferences[member.aadObjectId]) {
                result =
                    await objProactiveAppIntallationHelper.InstallAppInPersonalScope(
                        context.activity.conversation.tenantId,
                        member.aadObjectId
                    );
            }
            return result;
        });
        (await Promise.all(count)).forEach(function(statusCode) {
            if (statusCode === 409) ExistingAppInstallCount++;
            else if (statusCode === 201) NewAppInstallCount++;
        });
        await context.sendActivity(
            MessageFactory.text(
                'Existing: ' +
          ExistingAppInstallCount +
          ' \n\n Newly Installed: ' +
          NewAppInstallCount
            )
        );
    }

    async SendNotificationToAllUsersAsync(context) {
        const teamMembers = await TeamsInfo.getPagedMembers(context);
        const sentMsgCout = teamMembers.members.length;
        await Promise.all(teamMembers.members.map(async (member) => {
            const proactiveMessage = MessageFactory.text('Hi. New form available to update your skills!');
            const conversationParameters = {
                isGroup: false,
                bot: context.activity.recipient,
                tenantId: context.activity.conversation.tenantId,
                members: [{ id: member.aadObjectId ?? member.id }]
            };
            await context.adapter.createConversationAsync(
                process.env.MicrosoftAppId,
                context.activity.channelId,
                context.activity.serviceUrl,
                null,
                conversationParameters,
                async (context) => {
                    const conversationReference = TurnContext.getConversationReference(
                        context.activity
                    );
                    this.conversationReferences[conversationReference.conversation.id] = conversationReference;
                    console.log('conversationReference', conversationReference);

                    await context.adapter.continueConversationAsync(
                        process.env.MicrosoftAppId,
                        conversationReference,
                        async (context) => {
                            await context.sendActivity(proactiveMessage);
                        }
                    );
                }
            );
        }));
        await context.sendActivity(
            MessageFactory.text('Message sent:' + sentMsgCout)
        );
    }

    addConversationReference(activity) {
        if (activity.conversation.conversationType === 'personal') {
            const conversationReference = TurnContext.getConversationReference(activity);
            this.conversationReferences[conversationReference.conversation.id] = conversationReference;
        }
    }
}

module.exports.TeamsBot = TeamsBot;
