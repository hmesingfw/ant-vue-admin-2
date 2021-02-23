<template>
    <div style="padding:0 10px">
        <h-table
            keys="tTableRef"
            ref="tTableRef"
            :selection="multipleSelection"
            @selection="list => multipleSelection = list"
            url="https://mock.yonyoucloud.com/mock/8636/table"
            :params="tableParams"
            :table-attrs="{border:true}"
            @edit="edit"
        >
            <template slot="left-handle">
                <a-button @click="TableReflash(1000)">
                    <a-icon type="plus" />刷新
                </a-button>
                <a-button @click="query(1000)">
                    <a-icon type="plus" />刷新
                </a-button>
            </template>
            <template slot="right-handle">
                <a-button @click="TableReflash(1000)">
                    <a-icon type="plus" />刷新
                </a-button>
            </template>
        </h-table>

        <h-drawer v-model="drawer" title="弹框">
            <div v-for="i in 1000" :key="i">sdff</div>

            <!-- <template #footer>
                <el-button @click="query">取 消</el-button>
            </template>-->
        </h-drawer>
    </div>
</template>

<script>
import HTable from '@/components/HCust/Table'
import HDrawer from '@/components/HCust/Drawer'
export default {
    components: {
        HTable, HDrawer
    },
    props: {

    },
    data() {
        return {
            multipleSelection: [], // 多选选中的值
            tableParams: [
                { dataIndex: 'title', title: '标题', attr: { width: 160, } },
                { dataIndex: 'sex_text', title: '性别', attr: { width: 160, } },
                { dataIndex: 'content', title: '内容', attr: { width: 160, } },
                { dataIndex: 'createtime', title: '创建时间', attr: { width: 160, } },
                {
                    dataIndex: 'size', title: '文件大小', attr: { width: 100, },
                },
                {
                    dataIndex: 'md5', title: '张三',
                    labelF: () => <div>x张三</div>,
                    formatF: row => row.sex_text
                },
                {
                    dataIndex: 'status', title: '操作', attr: { width: 500, },
                    formatF: row => <div>
                        <a type="link" onClick={() => this.edit(row)} >  <a-icon type="delete" style="color:#F56C6C" />编辑</a>
                        <a type="link" onClick={() => this.openDrawer(row)}>  <a-icon type="delete" style="color:#F56C6C" />打开弹框</a>
                        <a type="link" onClick={() => this.handleTableRef(row)} >  <a-icon type="delete" style="color:#F56C6C" />打开Ref</a>
                    </div>
                },],
            drawer: false,

            /* 查询表单 */
            queryModel: {
                name: '221'
            },
            queryParams: [
                { title: '姓名：', dataIndex: 'name', type: 'input' },
                { title: '姓名：', dataIndex: 'name', type: 'input' },
                { title: '姓名：', dataIndex: 'name', type: 'input' },
                {
                    title: '性别：', dataIndex: 'sex', type: 'select', option: [{ title: '男', value: 1 }, { title: '女', value: 2 }]
                }, {
                    formatF: () => <div>
                        <a-button type='link' onClick={() => this.query()} icon='el-icon-delete'>查询</a-button>
                    </div>
                },
            ],
        }
    },
    watch: {
        multipleSelection(val) {
            console.log(val);
        }
    },
    methods: {
        edit(row = { a: 1 }) {
            console.log(row);
            this.drawer = true;
        },
        TableReflash() {
            console.log(this.multipleSelection);
        },
        handleTableRef() {
            const ref = this.$refs.tTableRef.getTableRef();
            console.log(ref);
        },
        query() {
            this.$refs.tTableRef.query({ page: 1 });
        },
        openDrawer() {
            this.drawer = true;
        },

    },
}
</script>
