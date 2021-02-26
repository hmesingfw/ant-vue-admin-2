<template>
    <page-layout :avatar="currUser.avatar">
        <template #headerContent>
            <div class="title">下午好，{{ currUser.name }}，休息一会儿吧</div>
            <div>{{ currUser.position[lang] }}</div>
        </template>
        <template #extra>
            <head-info class="split-right" title="项目数" content="56" />
            <head-info class="split-right" title="团队排名" content="8/24" />
            <head-info class="split-right" title="项目访问" content="2,223" />
        </template>
    </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import { mapState } from 'vuex'

export default {
    name: 'WorkPlace',
    components: { HeadInfo, PageLayout },
    computed: {
        ...mapState('account', { currUser: 'user' }),
        ...mapState('setting', ['lang'])
    },

}
</script>

<style lang="less">
@import "index";
</style>
