import { matchesPatterns } from "../../common";
import { Watcher } from "..";
import { Client as DiscordClient } from 'discord.js';

const matchers = [
  /daylend/gim
]

export class MentionWatcher implements Watcher {
  discord?: DiscordClient;

  constructor(discord?: DiscordClient) {
    this.discord = discord;
  };

  private async notify(message:string) {
    if (!this.discord) return;

    const user = await this.discord.users.fetch('113156025984520192');
    try {
      user.send(`Mention:\t${message}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  async message(channel: string, userstate: any, message: string, self: boolean) {
    const username = userstate['username'].toLowerCase();
    if (username==='daylend') return;
  
    if (matchesPatterns(message, undefined, matchers)) {
      await this.notify(`${channel}\t|\t${username}\t|\t${message}`);
    }
  }
}