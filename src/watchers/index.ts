import { Client as DiscordClient } from 'discord.js';

export declare class Watcher {
  constructor(discord?: DiscordClient);

  message(channel: string, userstate: any, message: string, self: boolean): void;
}

export * from './gm-buff';
export * from './giveaways';