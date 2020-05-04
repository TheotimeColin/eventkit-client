<template>
    <div class="Page Page--full GeneratorPage">
        <generator :init-config="config" />
    </div>
</template>

<script>
import Generator from '@/components/generators/Generator'
import config from '@/config/conversation-starters'

export default {
    name: 'ConversationStarters',
    components: { Generator },
    data: () => ({
        config: config
    })
}
</script>