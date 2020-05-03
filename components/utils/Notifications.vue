<template>
    <transition-group tag="div" name="appear-simple" class="Notifications">
        <notification
            :modifiers="[ note.type ]"
            v-for="note in notifications"
            :text="note.text"
            :id="note.id"
            @done="onDone"
            :key="note.id"
        />
    </transition-group>
</template>

<script>
import Notification from '@/components/utils/Notification'

export default {
    name: 'Notifications',
    components: { Notification },
    computed: {
        notifications () {
            return this.$store.state.utils.notifications
        }
    },
    methods: {
        onDone (id) {
            this.$store.commit('utils/removeNotification', id)
        }
    }
}
</script>

