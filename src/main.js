import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import { message } from 'ant-design-vue';
import Viser from 'viser-vue'

import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
// import { initI18n } from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'

const app = createApp(App)

// const i18n = initI18n(app, 'CN', 'US')
app.use(store)
const rou = router();
app.use(rou)
app.use(Antd)
app.use(Viser)
app.use(Plugins)

app.config.productionTip = false;
app.config.globalProperties.$message = message;

bootstrap({ router: rou, store, message: message })

app.mount('#app');
