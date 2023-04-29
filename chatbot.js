const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('The bot is online!');
});

const configuration = new Configuration({
  apiKey: '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'
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '1077668065896059013') return;
  if (!message.content.startsWith('Ai ')) return;

  let conversationLog = [{ role: 'system', content: 'You are a mean and sarcastic chatbot.' }];

  try {
    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 10 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (!message.content.startsWith('Ai')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (message.channel.id !== '1077668065896059013') return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role: 'user',
        content: msg.content,
      });
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        // max_tokens: 256, // limit token usage
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

      console.log(result);

    message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
});

client.login('MTEwMTkwNjkwNzcyOTUwMjI4OQ.G9YxPa.nrHnqk-Ux1-ahVlstmmpVFTVRTw0z5GV6QAUYI');