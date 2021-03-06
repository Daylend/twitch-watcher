import { Watcher } from "..";
import { Client as DiscordClient } from 'discord.js';

const prefixes = ['!'];
const RESET_INTERVAL = 1000 * 60 * 1;
const CHANNEL_RESET_INTERVAL = 1000 * 60 * 5;
const COUNT_THRESHOLD = 20;

export class GiveawayWatcher implements Watcher {
  discord?: DiscordClient;
  startTime: number;
  messages: Record<string, number>;
  alertedChannels: Record<string, number>;

  constructor(discord?: DiscordClient) {
    this.discord = discord;
    this.startTime = Date.now();
    this.messages = {};
    this.alertedChannels = {};
  };

  private async notify(message:string) {
    if (!this.discord) return;

    const user = await this.discord.users.fetch('113156025984520192');
    try {
      user.send(`Giveaway:\t${message}`);
    }
    catch (err) {
      console.log(err);
    }
  }

  async message(channel: string, userstate: any, message: string, self: boolean) {
    if (Date.now() - this.startTime > RESET_INTERVAL) {
      this.startTime = Date.now();
      this.messages = {};
      return;
    }

    const key = `${channel}:${message}`;

    // Filter on prefix
    if (prefixes.some((prefix) => {
      return message.startsWith(prefix);      
    })) {
      if (key in this.messages){
        if (++this.messages[key] >= COUNT_THRESHOLD) {
          // If unseen or it's been longer than the cooldown
          if (!(channel in this.alertedChannels)) {
            this.alertedChannels[channel] = Date.now();
            this.notify(`[${channel}]\t${message}`);
          } else if (Date.now() - this.alertedChannels[channel] > CHANNEL_RESET_INTERVAL) {
            this.alertedChannels[channel] = Date.now();
            this.notify(`[${channel}]\t${message}`);
          }
        }
      }
      else {
        this.messages[key] = 1;
      }
    }
  }
}