import ConversationStarters from '@/config/kits/conversation-starters'
import defaultConversationStarters from '@/config/kits/conversation-starters-default'

import Guessmojis from '@/config/kits/guessmojis'

export default {
    'conversation-starters': {
        theme: ConversationStarters,
        default: defaultConversationStarters
    },
    'guessmojis': {
        theme: Guessmojis
    }
}