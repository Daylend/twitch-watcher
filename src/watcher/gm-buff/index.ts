import { matchesPatterns } from "../../common";
import { Watcher } from "..";
import { Client as DiscordClient, TextChannel } from 'discord.js';

const discord_guild_id = '968651238075932672';
const discord_channel_id = '968651890088902686';

const gm_usernames = [
  'armintf',
  'blackdesertgame',
  'endlaive'
]

const mainMatchers = [
  /BA\s\d{1,2}/gim
]

const contextMatchers = [
  /drop rate/gim,
  /buff/gim,
]

const notify_cooldown = 1000 * 60 * 10; // 10m


export class BuffWatcher implements Watcher {
  discord?: DiscordClient;
  lastNotifyTimestamp: number;

  constructor(discord?: DiscordClient) {
    this.discord = discord;
    this.lastNotifyTimestamp = 0;
  };

  private async notify(message:string) {
    if (!this.discord) return;

    try {
      // const user = await this.discord.users.fetch('113156025984520192');
      const guild = await this.discord.guilds.fetch(discord_guild_id);
      const channel = await guild.channels.fetch(discord_channel_id) as TextChannel;

      const avatar = 'https://bdocodex.com/items/new_icon/03_etc/00015993.png';
      const hook = await channel.createWebhook('GM-Buff', { avatar, reason: 'Should be automatically deleted'});
      await hook.send(`**${(message.toUpperCase().match(mainMatchers[0]) as RegExpMatchArray)[0]}**`)
      await hook.delete();

      this.lastNotifyTimestamp = Date.now();
    }
    catch (err) {
      console.log(err);
    }
  }

  async message(channel: string, userstate: any, message: string, self: boolean) {
    const username = userstate['username'].toLowerCase();
    //if (username==='daylend') return;

    if (Date.now() - this.lastNotifyTimestamp < notify_cooldown) return;
  
    // Look for more context if they're not a GM
    if (matchesPatterns(message, mainMatchers, contextMatchers)) {
      await this.notify(`${channel}\t|\t${username}\t|\t${message}`);
    }
    else if (username in gm_usernames && matchesPatterns(message, mainMatchers)) {
      await this.notify(`${channel}\t|\t${username}\t|\t${message}`);
    }
  }
}
