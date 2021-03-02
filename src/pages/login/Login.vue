<template>
    <common-layout>
        <div class="top">
            <div class="header">
                <img alt="logo" class="logo" src="@/assets/img/logo.png" />
                <span class="title">{{ systemName }}</span>
            </div>
            <div class="desc">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>
        <div class="login">
            <a-form @submit="onSubmit" :model="form" :rules="rules" ref="formRef" :wrapper-col="{span:24}">
                <a-tabs size="large" :tab-bar-style="{textAlign: 'center'}" style="padding: 0 2px;">
                    <a-tab-pane tab="账户密码登录" key="1">
                        <a-alert type="error" :closable="true" v-show="error" :message="error" show-icon style="margin-bottom: 24px;" />
                        <a-form-item name="name">
                            <a-input v-model:value="form.name" size="large" placeholder="admin" style="width:100%">
                                <template #prefix>
                                    <UserOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="password">
                            <a-input size="large" v-model:value="form.password" placeholder="888888" type="password">
                                <template #prefix>
                                    <LockOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane tab="手机号登录" key="2">
                        <a-form-item>
                            <a-input size="large" placeholder="mobile number">
                                <template #prefix>
                                    <MobileOutlined />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item>
                            <a-row :gutter="8" style="margin: 0 -4px">
                                <a-col :span="16">
                                    <a-input size="large" placeholder="captcha">
                                        <template #prefix>
                                            <MailOutlined />
                                        </template>
                                    </a-input>
                                </a-col>
                                <a-col :span="8" style="padding-left: 4px">
                                    <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                                </a-col>
                            </a-row>
                        </a-form-item>
                    </a-tab-pane>
                </a-tabs>
                <div>
                    <a-checkbox :checked="true">自动登录</a-checkbox>
                    <a style="float: right">忘记密码</a>
                </div>
                <a-form-item>
                    <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" html-type="submit" type="primary">登录</a-button>
                </a-form-item>
                <div>
                    其他登录方式
                    <a-icon class="icon" type="alipay-circle" />
                    <a-icon class="icon" type="taobao-circle" />
                    <a-icon class="icon" type="weibo-circle" />
                    <router-link style="float: right" to="/dashboard/workplace">注册账户</router-link>
                </div>
            </a-form>
        </div>
    </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import { loadRoutes } from '@/utils/routerUtil'
import { mapMutations } from 'vuex'
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined } from '@ant-design/icons-vue';
export default {
    name: 'Login',
    components: { CommonLayout, UserOutlined, LockOutlined, MobileOutlined, MailOutlined },
    data() {
        return {
            logging: false,
            error: '',
            form: {
                name: '1',
                password: '1',
            },
            rules: {
                name: [
                    { required: true, message: '请输入账户名', whitespace: true }
                ],
                password: [
                    { required: true, message: '请输入密码', whitespace: true }
                ],
            },
        }
    },
    computed: {
        systemName() {
            return this.$store.state.setting.systemName
        }
    },
    methods: {
        ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
        async onSubmit(e) {
            e.preventDefault()

            this.$refs.formRef.validateFields().then((result) => {
                console.log('-----');
                console.log(result);
                if (!result) {
                    this.logging = true
                    const result = { data: {} };
                    result.data.permissions = [{ id: 'queryForm', operation: ['add', 'edit'] }]
                    result.data.roles = [{ id: 'admin', operation: ['add', 'edit', 'delete'] }]
                    result.code = 0
                    result.message = '张三，欢迎回来'
                    result.data.user = { 'name': 'JACK', 'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png', 'address': '赣州市', 'position': { 'CN': '前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台', 'HK': '前端工程師 | 螞蟻金服-計算服務事業群-VUE平台', 'US': 'Front-end engineer | Ant Financial - Computing services business group - VUE platform' } }
                    result.data.token = 'Authorization:' + Math.random()
                    result.data.expireAt = new Date(new Date().getTime() + 30 * 60 * 1000)
                    this.afterLogin(result);
                }
            }).catch((e) => {
                console.log(e);
            })

            this.logging = true
            const result = { data: {} };
            result.data.permissions = [{ id: 'queryForm', operation: ['add', 'edit'] }]
            result.data.roles = [{ id: 'admin', operation: ['add', 'edit', 'delete'] }]
            result.code = 0
            result.message = '张三，欢迎回来'
            result.data.user = { 'name': 'JACK', 'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png', 'address': '赣州市', 'position': { 'CN': '前端工程师 | 蚂蚁金服-计算服务事业群-VUE平台', 'HK': '前端工程師 | 螞蟻金服-計算服務事業群-VUE平台', 'US': 'Front-end engineer | Ant Financial - Computing services business group - VUE platform' } }
            result.data.token = 'Authorization:' + Math.random()
            result.data.expireAt = new Date(new Date().getTime() + 30 * 60 * 1000)
            this.afterLogin(result);
        },
        afterLogin(res) {
            this.logging = false
            const loginRes = res;
            if (loginRes.code >= 0) {
                const { user, permissions, roles } = loginRes.data
                this.setUser(user)
                this.setPermissions(permissions)
                this.setRoles(roles)
                // 获取路由配置

                loadRoutes([])
                this.$router.push('/dashboard/workplace')
                this.$message.success(loginRes.message, 3)
            } else {
                this.error = loginRes.message
            }
        }
    }
}
</script>

<style lang="less" scoped>
.common-layout {
    .top {
        text-align: center;
        .header {
            height: 44px;
            line-height: 44px;
            a {
                text-decoration: none;
            }
            .logo {
                height: 44px;
                vertical-align: top;
                margin-right: 16px;
            }
            .title {
                font-size: 33px;
                color: @title-color;
                font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
                    sans-serif;
                font-weight: 600;
                position: relative;
                top: 2px;
            }
        }
        .desc {
            font-size: 14px;
            color: @text-color-second;
            margin-top: 12px;
            margin-bottom: 40px;
        }
    }
    .login {
        width: 368px;
        margin: 0 auto;
        @media screen and (max-width: 576px) {
            width: 95%;
        }
        @media screen and (max-width: 320px) {
            .captcha-button {
                font-size: 14px;
            }
        }
        .icon {
            font-size: 24px;
            color: @text-color-second;
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;

            &:hover {
                color: @primary-color;
            }
        }
    }
}
</style>
