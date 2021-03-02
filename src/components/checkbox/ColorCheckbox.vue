<template>
    <div class="theme-color" :style="{backgroundColor: color}" @click="toggle">
        <CheckOutlined v-if="sChecked" />
    </div>
</template>

<script>
import { CheckOutlined } from '@ant-design/icons-vue';

export default {
    name: 'ColorCheckbox',
    components: { CheckOutlined },
    props: {
        color: {
            type: String,
            required: true
        },
        value: {
            type: [String, Number],
            required: true
        },
        checked: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            sChecked: this.initChecked()
        }
    },
    computed: {
    },
    inject: ['groupContext'],
    watch: {
        'sChecked': function () {
            const value = {
                value: this.value,
                color: this.color,
                checked: this.sChecked
            }
            this.$emit('change', value)
            const groupContext = this.groupContext
            if (groupContext) {
                groupContext.handleChange(value)
            }
        }
    },
    created() {
        const groupContext = this.groupContext
        if (groupContext) {
            groupContext.options.push(this)
        }
    },
    methods: {
        toggle() {
            if (this.groupContext.multiple || !this.sChecked) {
                this.sChecked = !this.sChecked
            }
        },
        initChecked() {
            const groupContext = this.groupContext
            if (!groupContext) {
                return this.checked
            } else if (groupContext.multiple) {
                return groupContext.defaultValues.indexOf(this.value) > -1
            } else {
                return groupContext.defaultValues[0] == this.value
            }
        }
    }
}
</script>

<style lang="less" scoped>
.theme-color {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    cursor: pointer;
    margin-right: 8px;
    text-align: center;
    color: @base-bg-color;
    font-weight: bold;
}
</style>
