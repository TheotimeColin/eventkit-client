<template>
    <div class="Form_helpers" v-if="value && errors">
        <i class="Form_helpersError fal fa-times color-error mr-10 fa-xs" v-show="Object.keys(errors).length > 0">
            <div class="Form_helpersList">
                <p v-for="(error, key) in errors" :key="key">
                    <i class="fal fa-times color-error mr-5 fa-xs"></i> {{ error.label }}
                </p>
            </div>
        </i>

        <i class="Form_helpersValid fal fa-check color-blue mr-10 fa-xs" v-show="Object.keys(errors).length <= 0"></i>
    </div>
</template>

<script>
export default {
    name: 'FormHelpers',
    props: {
        value: {},
        errors: {}
    }
}
</script>