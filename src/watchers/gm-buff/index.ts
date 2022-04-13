import { matchesPatterns } from "../../common";
import { Watcher } from "..";
import { Client as DiscordClient } from 'discord.js';

const gm_usernames = [
  'armintf',
  'blackdesertgame',
  'endlaive'
]

const mainMatchers = [
  /BA\s\d{1,2}/gim
]

const contextMatchers = [
  /drop rate/,
  /buff/,
]

export class BuffWatcher implements Watcher {
  discord?: DiscordClient;

  constructor(discord?: DiscordClient) {
    this.discord = discord;
  };

  private async notify(message:string) {
    if (!this.discord) return;

    const user = await this.discord.users.fetch('113156025984520192');
    try {
      user.send(`GM BUFF:\t${message}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  async message(channel: string, userstate: any, message: string, self: boolean) {
    const username = userstate['username'].toLowerCase();
  
    // Look for more context if they're not a GM
    if (matchesPatterns(message, mainMatchers, contextMatchers)) {
      await this.notify(`${channel}\t|\t${username}\t|\t${message}`);
    }
    else if (username in gm_usernames && matchesPatterns(message, mainMatchers)) {
      await this.notify(`${channel}\t|\t${username}\t|\t${message}`);
    }
  }
}
