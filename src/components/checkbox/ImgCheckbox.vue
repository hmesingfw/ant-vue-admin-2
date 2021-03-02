<template>
    <a-tooltip :title="title" :overlay-style="{zIndex: 2001}">
        <div class="img-check-box" @click="toggle">
            <img :src="img" />
            <div v-if="sChecked" class="check-item">
                <CheckOutlined />
            </div>
        </div>
    </a-tooltip>
</template>

<script>
import { CheckOutlined } from '@ant-design/icons-vue';

export default {
    name: 'ImgCheckbox',
    components: { CheckOutlined },
    props: {
        checked: {
            type: Boolean,
            required: false,
            default: false
        },
        img: {
            type: String,
            required: true
        },
        value: {
            required: true
        },
        title: String
    },
    data() {
        return {
            sChecked: this.initChecked()
        }
    },
    inject: ['groupContext'],
    watch: {
        'sChecked': function () {
            const option = {
                value: this.value,
                checked: this.sChecked
            }
            this.$emit('change', option)
            const groupContext = this.groupContext
            if (groupContext) {
                groupContext.handleChange(option)
            }
        }
    },
    created() {
        const groupContext = this.groupContext
        if (groupContext) {
            this.sChecked = groupContext.defaultValues.length > 0 ? groupContext.defaultValues.indexOf(this.value) >= 0 : this.sChecked
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
.img-check-box {
    margin-right: 16px;
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    .check-item {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: @primary-color;
        font-size: 14px;
        font-weight: bold;
    }
}
</style>
