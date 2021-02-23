
export default {
    props: {
        // 数据来源
        data: Array,
        params: Array,
        // 表格自定义扩展参数
        tableAttrs: { type: Object, default: () => { } },
    },
    created() {
        console.log(this.tableAttrs);
    },
    render() {
        return <a-table data-source={this.data} row-selection={this.rowSelection} {...this.tableAttrs} >
            {
                this.params.map(item => {
                    if (!item || !item.status) return;

                    return <a-table-column title={item.title} customRender={this.formatter.bind(this, item)} {...item.attr}  >
                    </a-table-column>
                })
            }
        </a-table>
    },
    computed: {
        rowSelection() {
            return {
                columnWidth: '50px',
                onChange: (selectedRowKeys, selectedRows) => {
                    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                    this.$emit('selections', selectedRows)
                },
                getCheckboxProps: record => ({
                    props: {
                        disabled: record.name === 'Disabled User', // Column configuration not to be checked
                        name: record.name,
                    },
                }),
            };
        },
    },
    methods: {
        formatter(item, row, column) {
            if (item.formatF) {
                return item.formatF(row, column);
            }

            return item.dataIndex ? row[item.dataIndex] || '' : '';
        },
        /* 渲染表格表头  */
        renderHeader(obj, item) {
            console.log(item);
            if (item.labelF) {
                return item.labelF()
            }
            return item.title;
        },
        /* 多选操作 */
        selectionChange(val) {
            this.$emit('selections', val);
        },
        getTableRef() {
            return this.$refs.hCustTableRef;
        },
    },
}
//  render-header={renderHeader.bind(this, item)}
// customRender={this.formatter.bind(this, item)}