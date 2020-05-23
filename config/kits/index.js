import ConversationStarters from '@/config/kits/conversation-starters'
import defaultConversationStarters from '~/config/kits/defaults/conversation-starters-default'
import coverConversationStarters from '~/config/kits/cover/conversation-starters-cover'

import Guessmojis from '@/config/kits/guessmojis'
import defaultGuessmojis from '@/config/kits/defaults/guessmojis-default'

export default {
    'conversation-starters': {
        theme: ConversationStarters,
        default: defaultConversationStarters,
        cover: coverConversationStarters
    },
    'guessmojis': {
        theme: Guessmojis,
        default: defaultGuessmojis
    }
}