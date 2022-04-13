import { Watcher } from "..";
import { Client as DiscordClient } from 'discord.js';

export class GiveawayWatcher implements Watcher {
  discord?: DiscordClient;

  constructor(discord?: DiscordClient) {
    this.discord = discord;
  };

  async message(channel: string, userstate: any, message: string, self: boolean) {
    return;
  }
}