import { Plugin } from '@vizality/entities';
import { getModule } from '@vizality/webpack';

const Message = getModule('getLastEditableMessage');
const { getChannelId } = getModule(m => m?._dispatchToken && m?.getChannelId);
const { editMessage } = getModule(m => m?.editMessage && m?.sendMessage);

export default class extends Plugin {
  start () {
    if (!this.settings.getKeys().length) this.settings.set('SuccessMessage', true);

    vizality.api.commands.registerCommand({
      command: 'replace',
      description: 'Replace last message sent in this channel using regex.',
      options: [
        {
          name: 'Search: Regex',
          required: true
        },
        {
          name: 'Replace: String',
          required: true
        }
      ],
      executor: args => this.replaceRegex(args)
    });
  }

  replaceRegex (args) {
    const [ , search, replace, rest ] = args.join(' ').match(/(\/[^/]+\/[^ ]*) ([^ ]+)(.*)/) ?? Array(4).fill(null);
    if (rest || !(search && replace)) return this.errorMessage();

    const [ , pattern, flags ] = (search.match(/\/([^/]+)\/([^/]*)/));
    const { content: lastMessageContent, id: lastMessageId } = Message.getLastEditableMessage(getChannelId());

    try {
      const newContent = lastMessageContent.replace(new RegExp(pattern, flags), replace);
      if (newContent !== lastMessageContent) {
        editMessage(getChannelId(), lastMessageId, { content: newContent });
        if (this.settings.get('SuccessMessage', true)) {
          return {
            send: false,
            result: {
              type: 'rich',
              color: 0x00ff00,
              title: 'Success',
              description: `Replaced: ${lastMessageContent}\nTo: ${newContent}`
            }
          };
        }
      } else {
        return {
          send: false,
          result: {
            type: 'rich',
            color: 0x00ff00,
            title: 'No Change',
            description: 'Nothing was edited'
          }
        };
      }
    } catch {
      return this.errorMessage();
    }
  }

  errorMessage () {
    return {
      send: false,
      result: {
        type: 'rich',
        color: 0xff0000,
        title: 'Error',
        description: `Usage: \`.replace <Search: Regex> <Replace: String>\`\nRegex format: \`/pattern/flags\`, flags are optional`
      }
    };
  }

  stop () {
    vizality.api.commands.unregisterCommandsByCaller(this.addonId);
  }
}
