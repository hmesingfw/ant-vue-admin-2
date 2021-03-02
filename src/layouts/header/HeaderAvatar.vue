<template>
    <a-dropdown>
        <div class="header-avatar" style="cursor: pointer">
            <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar" />
            <span class="name">{{ user.name }}, {{ time.h }}好！</span>
        </div>
        <template #overlay>
            <a-menu :class="['avatar-menu']">
                <a-menu-item>
                    <a-icon type="user" />
                    <span>个人中心</span>
                </a-menu-item>
                <a-menu-item>
                    <a-icon type="setting" />
                    <span>设置</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="logout">
                    <a-icon style="margin-right: 8px;" type="poweroff" />
                    <span>退出登录</span>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'HeaderAvatar',
    computed: {
        ...mapGetters('account', ['user']),
    },
    data() {
        return {
            time: {},
        }
    },
    created() {
        const date = new Date();
        this.time = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            w: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
            h: date.getHours() < 12 ? '上午' : '下午',
        }
    },
    methods: {
        logout() {
            this.$router.push('/login')
        }
    }
}
</script>

<style lang="less">
.header-avatar {
    display: inline-flex;
    .avatar,
    .name {
        align-self: center;
    }
    .avatar {
        margin-right: 8px;
    }
    .name {
        font-weight: 500;
    }
}
.avatar-menu {
    width: 150px;
}
</style>
