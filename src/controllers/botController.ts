const {Telegraf, Markup, Extra, TelegrafContext} = require('telegraf')
import {NextFunction} from "express";
import TelegrafQuestion from "telegraf-question";

const LocalSession = require('telegraf-session-local');
import {BotQuires, BotCommands, AnswersQuires} from "../utilites/botQuires";

const bot = new Telegraf(process.env.TOKEN);

// config bot
// using session
bot.use((new LocalSession({database: 'health_db.json'})).middleware());
// using TelegrafQuestion to ask question and get answer back
bot.use(TelegrafQuestion({
    cancelTimeout: 300000 // 5 min
}));

export function initialStart() {
    bot.start((fn: any) => {
            fn.replyWithHTML(`${BotQuires.welcomingUser.query}`);
            fn.replyWithHTML(BotQuires.instructions);
        }
    );

    // init help command
    bot.command('help', async (fn: any) => {
        await fn.replyWithHTML('<b>available commands</b>', Markup.inlineKeyboard(
            [Markup.button.callback(`${BotCommands.doHealthCheck.name}`, `do_check`),]
            )
                .oneTime()
                .resize()
        )

    });
    // triggered after help
    // starting check process
    bot.action('do_check', async (fn: any, next: NextFunction) => {
        await fn.replyWithHTML(`<b>Rate quality of tracking the shipment from 0 to 5</b>`, Markup.inlineKeyboard([
            [
                Markup.button.callback(AnswersQuires.ratingQuality.zero.num, AnswersQuires.ratingQuality.zero.num),
                Markup.button.callback(AnswersQuires.ratingQuality.one.num, AnswersQuires.ratingQuality.one.num),
                Markup.button.callback(AnswersQuires.ratingQuality.two.num, AnswersQuires.ratingQuality.two.num),
                Markup.button.callback(AnswersQuires.ratingQuality.three.num, AnswersQuires.ratingQuality.three.num),
                Markup.button.callback(AnswersQuires.ratingQuality.four.num, AnswersQuires.ratingQuality.four.num),
                Markup.button.callback(AnswersQuires.ratingQuality.five.num, AnswersQuires.ratingQuality.five.num)
            ],
            [Markup.button.callback('cancel', 'cancel')]
        ]));


    });
    // action for user interaction after choosing rating
    // if he choose 0
    bot.action(AnswersQuires.ratingQuality.zero.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.zero.num;
        checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.one.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.one.num;
        await checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.two.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.two.num;
        checkPhysicalStatus(fn);
        return next();
    });
    bot.action(AnswersQuires.ratingQuality.three.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.three.num;
        checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.four.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.four.num;
        checkPhysicalStatus(fn);
        return next();
    });

    bot.action(AnswersQuires.ratingQuality.five.num, async (fn: any, next: NextFunction) => {
        fn.session.ratedQuality = AnswersQuires.ratingQuality.five.num;
        checkPhysicalStatus(fn);

        return next();
    });

    bot.action('bad', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `bad`;
        // next
        next();
    });

    bot.action('good', async (fn: any, next: NextFunction) => {
        fn.session.physicalQuality = `good`;
        // next
        return next();
    });

    bot.command('/stat', (fn: any) => {
        fn.replyWithHTML(`database has ${fn.session.ratedQuality}`)
    });

    bot.action(`cancel`, (_: any) => {
        quitBot();
    });

    bot.on(`photo`, (fn: any) => {
        if (fn.message.photo) {
            console.log(`there is a photo`);
            fn.session.productPhoto = fn.message.photo;
            fn.replyWithPhoto(fn.session.productPhoto);
        }

    });
    // quit bot will be triggered when user type /quit
    quitBot();

    bot.launch();

// Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

function quitBot() {
    // quitting the bot
    bot.command(BotCommands.quit, (fn: any) => {
        // Explicit usage
        fn.telegram.leaveChat(fn.message.chat.id);
        fn.replyWithHTML(`<b>bye bye 👋🏻</b>`)
        // Using context shortcut
        fn.leaveChat();
    });


}

function checkPhysicalStatus(fn: any) {
    fn.replyWithHTML(`<b>How was the physical status of the product? </b>`, Markup.inlineKeyboard(
        [Markup.button.callback(`Good`, `good`), Markup.button.callback(`Bad`, 'bad')]
    ));

    fn.replyWithHTML(`<b> You can send photo of the current product</b>`);
}
