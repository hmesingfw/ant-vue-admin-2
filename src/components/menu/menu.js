/**
 * 该插件可根据菜单配置自动生成 ANTD menu组件
 * menuOptions示例：
 * [
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  },
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  }
 * ]
 *
 * i18n: 国际化配置。系统默认会根据 options route配置的 path 和 name 生成英文以及中文的国际化配置，如需自定义或增加其他语言，配置
 * 此项即可。如：
 * i18n: {
 *   messages: {
 *     CN: {dashboard: {name: '监控中心'}}
 *     HK: {dashboard: {name: '監控中心'}}
 *   }
 * }
 **/
import { h } from 'vue'
import Menu from 'ant-design-vue/es/menu'
// import Icon from 'ant-design-vue/es/icon'
import fastEqual from 'fast-deep-equal'
import { AppstoreAddOutlined } from '@ant-design/icons-vue';

const { Item, SubMenu } = Menu

export default {
    name: 'IMenu',
    props: {
        options: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            required: false,
            default: 'dark'
        },
        mode: {
            type: String,
            required: false,
            default: 'inline'
        },
        collapsed: {
            type: Boolean,
            required: false,
            default: false
        },
        i18n: Object,
        // openKeys: Array
    },
    components: { AppstoreAddOutlined },
    data() {
        return {
            selectedKeys: [],
            sOpenKeys: [],
            cachedOpenKeys: [],
            openKeys: [],
        }
    },
    computed: {
        menuTheme() {
            return this.theme == 'light' ? this.theme : 'dark'
        }
    },
    created() {
        this.updateMenu()
        if (this.options.length > 0 && !this.options[0].fullPath) {
            this.formatOptions(this.options, '')
        }
        // // 自定义国际化配置
        // if (this.i18n && this.i18n.messages) {
        //     const messages = this.i18n.messages
        //     Object.keys(messages).forEach(key => {
        //         this.$i18n.mergeLocaleMessage(key, messages[key])
        //     })
        // }
    },
    emits: ['openChange', 'update:openKeys', 'select'],
    watch: {
        options(val) {
            if (val.length > 0 && !val[0].fullPath) {
                this.formatOptions(this.options, '')
            }
        },
        i18n(val) {
            if (val && val.messages) {
                const messages = this.i18n.messages
                Object.keys(messages).forEach(key => {
                    this.$i18n.mergeLocaleMessage(key, messages[key])
                })
            }
        },
        collapsed(val) {
            if (val) {
                this.cachedOpenKeys = this.sOpenKeys
                this.sOpenKeys = []
            } else {
                this.sOpenKeys = this.cachedOpenKeys
            }
        },
        '$route': function () {
            this.updateMenu()
        },
        sOpenKeys(val) {
            this.$emit('openChange', val)
            this.$emit('update:openKeys', val)
        }
    },
    methods: {
        renderIcon() {
            return <AppstoreAddOutlined />
        },
        renderMenuItem: function (h, menu) {
            let tag;
            if (menu.meta && menu.meta.link) {
                tag = <a style='overflow:hidden;white-space:normal;text-overflow:clip;' href={menu.meta.link} target='_blank' >{this.renderIcon()} {menu.name}</a>
            } else {
                tag = <router-link to={menu.fullPath} style='overflow:hidden;white-space:normal;text-overflow:clip;'> {this.renderIcon()} {menu.name}</router-link>
            }
            return <Item key={menu.fullPath}>
                {tag}
            </Item>
        },

        renderSubMenu: function (h, menu) {
            const this_ = this
            const subItem = <span style='overflow:hidden;white-space:normal;text-overflow:clip;'>{this.renderIcon()} <span>{menu.name}</span></span>
            const itemArr = []
            menu.children.forEach(function (item) {
                itemArr.push(this_.renderItem(h, item))
            })
            return <SubMenu key={menu.fullPath}>
                {{
                    default: () => itemArr,
                    title: () => subItem
                }}
            </SubMenu>
        },
        renderItem(h, menu) {
            const meta = menu.meta
            if (!meta || !meta.invisible) {
                let renderChildren = false
                const children = menu.children
                if (children != undefined) {
                    for (let i = 0; i < children.length; i++) {
                        const childMeta = children[i].meta
                        if (!childMeta || !childMeta.invisible) {
                            renderChildren = true
                            break
                        }
                    }
                }
                return (menu.children && renderChildren) ? this.renderSubMenu(h, menu) : this.renderMenuItem(h, menu)
            }
        },
        renderMenu: function (h, menuTree) {
            const this_ = this
            const menuArr = []
            menuTree.forEach(function (menu, i) {
                menuArr.push(this_.renderItem(h, menu))
            })
            return menuArr
        },
        formatOptions(options, parentPath) {
            options.forEach(route => {
                const isFullPath = route.path.substring(0, 1) == '/'
                route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
                if (route.children) {
                    this.formatOptions(route.children, route.fullPath)
                }
            })
        },
        updateMenu() {
            const matchedRoutes = this.$route.matched.filter(item => item.path !== '')
            this.selectedKeys = this.getSelectedKey(this.$route)
            let openKeys = matchedRoutes.map(item => item.path)
            openKeys = openKeys.slice(0, openKeys.length - 1)
            if (!fastEqual(openKeys, this.sOpenKeys)) {
                this.collapsed || this.mode === 'horizontal' ? this.cachedOpenKeys = openKeys : this.sOpenKeys = openKeys
            }
        },
        getSelectedKey(route) {
            return route.matched.map(item => item.path)
        },
        menuClick(obj) {
            console.log(obj);
            obj.selectedKeys = [obj.key]
            this.$emit('select', obj)
        },
    },
    render() {
        return <Menu theme={this.menuTheme} mode={this.$props.mode} selectedKeys={this.selectedKeys} onClick={obj => this.menuClick(obj)}>
            {{
                default: () => this.renderMenu(h, this.options),
            }}
        </Menu>
    }
}
// v-models={[[this.selectedKeys, 'selectedKeys'],]}
