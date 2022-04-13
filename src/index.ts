import tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import partners from './partners.json';
import { Watcher, BuffWatcher } from './watchers';

dotenv.config({ override: false });

const client_id = process.env.TWITCH_CLIENT_ID ?? '';
const client_secret = process.env.TWITCH_CLIENT_SECRET ?? '';

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

const twitchClient = new tmi.Client({
  options: { debug: false, joinInterval: 300 },
  channels: test_channels
});

const plugins: Watcher[] = [
  new BuffWatcher()
]

async function main() {
  await twitchClient.connect();
  
  twitchClient.on('message', (channel, userstate, message, self) => {
    if (self) return;

    plugins.forEach(async (plugin) => {
      plugin.message(channel, userstate, message, self);
    });
  });
}

main();