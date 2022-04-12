import tmi from 'tmi.js';
import * as dotenv from 'dotenv';
import partners from './partners.json';
import url from 'url';

dotenv.config({ override: false });

const client_id = process.env.TWITCH_CLIENT_ID ?? '';
const client_secret = process.env.TWITCH_CLIENT_SECRET ?? '';
const test_channels = [
  'daylend',
  'sofrosty'
];
const gm_usernames = [
  'armintf',
  'blackdesertgame',
  'endlaive'
]
const partner_channels: string[] = partners.reduce((results: any, partner) => {
  if (partner._cultureCodeList === 'en-US' && partner._twitchUrl) {
    const url = new URL(partner._twitchUrl);
    results.push(url.pathname.replace('/',''));
  };
  return results;
}, []);

const client = new tmi.Client({
  options: { debug: false, joinInterval: 300 },
  channels: test_channels
});

const mainMatchers = [
  /BA\s\d{1,2}/gim
]

const contextMatchers = [
  /drop rate/,
  /buff/,
]

function matchesPatterns(str:string, all?: RegExp[], one?: RegExp[]): boolean {
  return (!all || all?.every((reg) => {
    return str.match(reg);
  })) && (!one || one?.some((reg) => {
    return str.match(reg);
  }));
}

async function main() {
  await client.connect();
  
  client.on('message', (channel, userstate, message, self) => {
    if (self) return;

    const username = userstate['username'] ?? '';
  
    // Look for more context if they're not a GM
    if (matchesPatterns(message, mainMatchers, contextMatchers)) {
      console.log(`${channel}\t|\t${username}\t|\t${message}`);
    }
    else if (username in gm_usernames && matchesPatterns(message, mainMatchers)) {
      console.log(`${channel}\t|\t${username}\t|\t${message}`);
    }
  });
}

main();