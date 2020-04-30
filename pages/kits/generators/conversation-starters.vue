<template>
    <div class="Page Page--full">
        <div class="Page_content">
            <card-generator />
        </div>
    </div>
</template>

<script>
import CardGenerator from '@/components/generators/CardGenerator'

export default {
    name: 'ConversationStarters',
    components: { CardGenerator }
}
</script>