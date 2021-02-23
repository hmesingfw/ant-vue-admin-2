<template>
    <a-drawer ref="hCustDrawer" :visible="value" :title="title" v-bind="setupAttrs" :close="handleClose" bodyStyle="padding:0">
        <div class="h-drawer">
            <div class="h-drawer-scrollbar" :style="{height:mainStyleHeight}">
                <div class="h-drawer__main">
                    <slot />
                </div>
            </div>
            <!-- 底部操作按钮，传入slot:footer 替换 -->
            <a-row type="flex" justify="end" class="h-drawer__footer">
                <slot name="footer">
                    <a-button @click="handleClose">取 消</a-button>
                    <a-button type="primary" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</a-button>
                </slot>
            </a-row>
        </div>
    </a-drawer>
</template>

<script>
// import { ref, onMounted } from 'vue'
export default {

    props: {
        value: { type: Boolean, default: false },
        title: { type: String, default: '' },
        attrs: { type: Object, default: () => { } },
    },
    data() {
        return {
            setupAttrs: {
                width: '600px',
            },
            mainStyleHeight: 0,
            loading: false,
        }
    },
    methods: {
        handleClose() {
            this.$emit('input', false); // modelValue  默认绑定v-model
        }
    },
    created() {
        this.setupAttrs = {
            ...this.setupAttrs,
            ...this.attrs
        }
        const clientHeight = document.documentElement.clientHeight; // 屏幕高度
        const titleHeight = !this.attrs ? 35 : 0; // 标题高度
        const footerHeight = 61; // 底部高度
        const padding = 20; // padding高度
        this.mainStyleHeight = (clientHeight - titleHeight - footerHeight - padding) + 'px';
    },
}
</script>
