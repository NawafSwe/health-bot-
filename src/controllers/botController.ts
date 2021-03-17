const {Telegraf, Markup, Extra} = require('telegraf')
import {BotQuires} from "../utilites/botQuires";

const bot = new Telegraf(process.env.BOT_API);

export function initialStart() {
    bot.start((fn: any) => fn.reply(`${BotQuires.welcomingUser.query}`));
    bot.hears('hello', (fn: any) => {
        fn.replyWithHTML(`${BotQuires.askUserHealth.query}`,
            Markup.keyboard([
                Markup.button.text(`${BotQuires.askUserHealth.firstChoice}`),
                Markup.button.text(`${BotQuires.askUserHealth.secondChoice}`)

            ])
        )
        bot.action(`${BotQuires.askUserHealth.firstChoice}`, (fn: any) => {
            fn.editMessageText('<i>Have a nice day 😊</i>',
            )
        });

        bot.action(`${BotQuires.askUserHealth.secondChoice}`, (fn: any) => {
            fn.editMessageText('<i>May happiness be with you 🙏</i>',)
        })
    });

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

export function quitBot() {
    bot.command('quit', (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);

        // Using context shortcut
        fn.leaveChat();
    })
}

