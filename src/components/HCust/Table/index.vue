<template>
    <div :ref="keys" class="h-table">
        <a-row class="h-table-handle" type="flex" justify="space-between">
            <div>
                <a-button>
                    <a-icon type="search" />搜索
                </a-button>
                <slot name="add">
                    <a-button @click="EditInfo()">
                        <a-icon type="plus" />新增
                    </a-button>
                </slot>
                <slot name="del">
                    <a-button plain @click="DeleteInfo()">
                        <a-icon type="delete" style="color:#F56C6C" />&nbsp;批量删除
                    </a-button>
                </slot>
                <slot name="left-handle" />
            </div>
            <div class="right-handle">
                <slot name="right-handle" />
                <a-button @click="TableReflash(1000)">
                    <a-icon type="reload" />刷新
                </a-button>

                <a-popover placement="bottom" :width="240" trigger="click" popper-class="h-table-col-settings">
                    <template slot="content">
                        <a-row type="flex" justify="space-between" align="middle" class="h-table-col-settings__header">
                            <div>
                                <a-checkbox v-model="settingCheckAll" :indeterminate="isIndeterminate" @change="ChangeColSettingAll">列展示</a-checkbox>
                            </div>
                            <a-button type="text" @click="DefaultColSettings(true)">重置</a-button>
                        </a-row>
                        <a-row class="h-table-col-settings__group">
                            <draggable v-model="colSettings" draggable=".drag" animation="300" @end="ChangeSettingsCol()">
                                <div v-for="(item, i) in colSettings" :key="i" class="item" :class="{'drag':item.prop != 'selection'}">
                                    <!-- <i :class="item.prop == 'selection' ? 'el-icon-menu' : 'el-icon-rank'" /> -->
                                    <a-checkbox v-model="item.status" @change="ChangeSettingsCol">{{ item.title }}</a-checkbox>
                                </div>
                            </draggable>
                        </a-row>
                    </template>

                    <a-button>
                        <a-icon type="setting" />显示列
                        <a-icon type="caret-down" />
                    </a-button>
                </a-popover>
            </div>
        </a-row>
        <a-spin :spinning="tableLoading">
            <h-main v-if="tableStatus" ref="hCustTableRef" :selection="selection" :data="tableData" :table-attrs="setupTableAttrs" :params="colSettings" @selections="Selection" />
        </a-spin>
        <div class="h-page">
            <a-pagination show-size-changer :default-current="pageData.page" :total="pageData.total" @showSizeChange="PageCurrentChange" @change="PageSizeChange" />
        </div>
    </div>
</template>

<script>
// import { ref, reactive, onMounted, nextTick } from 'vue'
import http from '@/config/axios-config'
import hMain from './main'
import draggable from 'vuedraggable'
import { message } from 'ant-design-vue';
export default {
    components: {
        hMain,
        draggable,
    },
    props: {
        // 请求地址
        url: { type: String },
        keys: { type: String, default: 'hCustRef' },
        // 数据来源
        params: Array,
        // 表格自定义扩展参数
        tableAttrs: { type: Object, default: () => { } },
        // 多选的值
        selection: { type: Array, default: () => [] },
        page: {
            type: Object, default: () => ({
                size: 10,
                sizes: [10, 20, 30, 50],
                layout: 'total, sizes, prev, pager, next, jumper'
            })
        }
    },
    data() {
        return {
            pageData: { total: 0, page: 1, size: 10 }, // 分页参数
            tableLoading: false,
            tableData: [],
            tableStatus: true, // 表格if 
            colSettings: [], // 列的设置参数
            isIndeterminate: false, // 列的设置参数,  用以表示 checkbox 的不确定状态，一般用于实现全选的效果
            settingCheckAll: true, // 列的设置参数, 多选状态
            setupTableAttrs: {
                rowKey: "id",
                pagination: false,
            },
        }
    },
    created() {
        this.setupTableAttrs = {
            ... this.setupTableAttrs,
            ...this.tableAttrs,
        }

        this.query();
        this.InitSettingsCol();
    },
    methods: {
        // 获取table ref 对象
        getTableRef() {
            return this.$refs.hCustTableRef.getTableRef();
        },
        /**
        *  查询列表
        * parentParams 父组件查询传参
       */
        async query(parentParams = {}) {
            /* 传页码赋值 */
            if (parentParams.page) this.pageData.page = parentParams.page;
            if (parentParams.size) this.pageData.size = parentParams.size;
            /* 查询参数 */
            const params = {
                page: this.pageData.page,
                size: this.pageData.size,
                ...parentParams,
            }
            this.tableLoading = true;
            try {
                const res = await http.get(this.url, { params: params });
                if (res.code == 200) {
                    const data = res.data;
                    this.tableData = data.list;
                    this.pageData.total = data.total;
                } else {
                    message.info(res.message)
                }
                this.tableLoading = false;
            } catch (err) {
                console.log(err);
                this.tableLoading = false;
            }
        },

        /**
        *  重新刷新table
        *  time  列表刷新时间  number 毫秒
       */
        async TableReflash(time = 0) {
            this.tableLoading = true;
            this.tableStatus = false;
            await this.$nextTick();
            this.tableStatus = true;
            if (time > 0) {
                setTimeout(() => { this.tableLoading = false; }, time)
            } else {
                this.tableLoading = false;
            }
        },

        /* 操作分页 */
        PageSizeChange(val) {
            this.pageData.size = val;
            this.query();
        },
        PageCurrentChange(val) {
            this.pageData.page = val;
            this.query();
        },

        /**
         *  初始化设置列设置参数
         */
        InitSettingsCol() {
            try {
                const localSettings = localStorage.getItem('col-settings-' + this.keys);

                if (localSettings) {
                    const array = JSON.parse(localSettings);
                    const retArray = array.map(item => {
                        const data = this.params.filter(p => p.dataIndex == item.dataIndex);
                        return {
                            ...data[0],
                            status: item.status,
                        }
                    })
                    this.colSettings = retArray;
                    return;
                }
            } catch (error) {
                console.log(error);
            }
            this.DefaultColSettings();
        },
        /**
         *  默认列设置，赋值
         *  reset 是否重置  boolean
        */
        DefaultColSettings(reset) {
            this.colSettings = this.params.map(item => {
                return {
                    ...item,
                    status: true,
                }
            });
            if (reset === true) {
                this.ChangeSettingsCol(true);
            }
        },

        /* 设置列参数方法 */
        ChangeSettingsCol(status) {
            this.isIndeterminate = this.colSettings.some(item => item.status !== status); // indeterminate 属性用以表示 checkbox 的不确定状态
            this.settingCheckAll = this.colSettings.every(item => item.status === true);

            try {
                const str = JSON.stringify(this.colSettings)
                localStorage.setItem('col-settings-' + this.keys, str)
            } catch (error) {
                console.log(error);
            }

            this.TableReflash(500);
        },
        /* 列设置，全选操作 */
        ChangeColSettingAll(status) {
            this.isIndeterminate = false;
            this.colSettings = this.params.map(item => {
                return {
                    ...item,
                    status: status,
                }
            });
            this.TableReflash(500);
        },

        /**
         * 编辑内容
         */
        EditInfo(info) {
            this.$emit('edit', info)
        },
        /**
         * 删除内容
         */
        DeleteInfo(list) {
            this.$emit('del', list)
        },
        /**
         *  多选
         */
        Selection(val) {
            this.$emit('selection', val);
        },

    },
}
</script>
