<template>
    <a-layout-header :class="[headerTheme, 'admin-header']">
        <div :class="['admin-header-wide', layout, pageWidth]">
            <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
                <img width="32" src="@/assets/img/logo.png" />
                <h1 v-if="!isMobile">{{ systemName }}</h1>
            </router-link>
            <a-divider v-if="isMobile" type="vertical" />
            <!-- <a-icon v-if="layout !== 'head'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse" /> -->
            <MenuUnfoldOutlined v-if="layout !== 'head'" class="trigger" @click="toggleCollapse" />
            <MenuFoldOutlined v-else class="trigger" @click="toggleCollapse" />
            <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
                <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect" />
            </div>
            <div :class="['admin-header-right', headerTheme]">
                <a-tooltip class="header-item" title="帮助文档" placement="bottom">
                    <a href="https://iczer.gitee.io/vue-antd-admin-docs/" target="_blank">
                        <QuestionCircleOutlined />
                    </a>
                </a-tooltip>
                <header-notice class="header-item" />
                <header-avatar class="header-item" />
                <a-dropdown class="lang header-item">
                    <div>
                        <GlobalOutlined />
                        {{ langAlias }}
                    </div>
                    <template #overlay>
                        <a-menu @click="val => setLang(val.key)" :selected-keys="[lang]">
                            <a-menu-item v-for=" lang in langList" :key="lang.key">{{ lang.key.toLowerCase() + ' ' + lang.name }}</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderAvatar'
import IMenu from '@/components/menu/menu'
import { mapState, mapMutations } from 'vuex'
import { QuestionCircleOutlined, GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
export default {
    name: 'AdminHeader',
    components: { IMenu, HeaderAvatar, HeaderNotice, QuestionCircleOutlined, GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined },
    props: ['collapsed', 'menuData'],
    data() {
        return {
            langList: [
                { key: 'CN', name: '简体中文', alias: '简体' },
                { key: 'HK', name: '繁體中文', alias: '繁體' },
                { key: 'US', name: 'English', alias: 'English' }
            ],
        }
    },
    computed: {
        ...mapState('setting', ['theme', 'isMobile', 'layout', 'systemName', 'lang', 'pageWidth']),
        headerTheme() {
            if (this.layout == 'side' && this.theme.mode == 'dark' && !this.isMobile) {
                return 'light'
            }
            return this.theme.mode
        },
        langAlias() {
            const lang = this.langList.find(item => item.key == this.lang)
            return lang.alias
        },
        menuWidth() {
            const { layout } = this
            const headWidth = layout === 'head' ? '100% - 188px' : '100%'
            const extraWidth = '400px'
            return `calc(${headWidth} - ${extraWidth})`
        }
    },
    emits: ['toggleCollapse'],
    methods: {

        toggleCollapse() {
            this.$emit('toggleCollapse')
        },
        onSelect(obj) {
            this.$emit('menuSelect', obj)
        },
        ...mapMutations('setting', ['setLang'])
    }
}
</script>

<style lang="less" scoped>
@import "index";
</style>
