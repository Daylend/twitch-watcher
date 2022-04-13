import { matchesPatterns } from "../../common";
import { Watcher } from "..";

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
  discord: any;

  GMBuffPlugin(discord?: any) {
    this.discord = discord;
  };

  async message(channel: string, userstate: any, message: string, self: boolean) {
    const username = userstate['username'].toLowerCase();
  
    // Look for more context if they're not a GM
    if (matchesPatterns(message, mainMatchers, contextMatchers)) {
      console.log(`${channel}\t|\t${username}\t|\t${message}`);
    }
    else if (username in gm_usernames && matchesPatterns(message, mainMatchers)) {
      console.log(`${channel}\t|\t${username}\t|\t${message}`);
    }
  }
}
