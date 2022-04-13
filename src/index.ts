import tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import partners from './partners.json';
import { Watcher, BuffWatcher, GiveawayWatcher } from './watchers';
import { Client, Intents } from 'discord.js';

dotenv.config({ override: false });

const test_channels = [
  'daylend',
  'sofrosty'
];

const partner_channels: string[] = partners.reduce((results: any, partner) => {
  if (partner._cultureCodeList === 'en-US' && partner._twitchUrl) {
    const url = new URL(partner._twitchUrl);
    results.push(url.pathname.replace('/',''));
  };
  return results;
}, []);

async function main() {
  const twitchClient = new tmi.Client({
    options: { debug: false, joinInterval: 300 },
    channels: test_channels
  });
  
  const discordClient = new Client({ intents: [Intents.FLAGS.DIRECT_MESSAGES]});

  await Promise.all([
    await twitchClient.connect(),
    discordClient.once('ready', () => {
      console.log('Discord initialized');
    })]
  );

  discordClient.login(process.env.DISCORD_TOKEN);

  const plugins: Watcher[] = [
    new BuffWatcher(discordClient),
    new GiveawayWatcher()
  ]
  
  twitchClient.on('message', (channel, userstate, message, self) => {
    if (self) return;

    plugins.forEach(async (plugin) => {
      await plugin.message(channel, userstate, message, self);
    });
  });
}

main();