
export default {
    name: 'ImgCheckboxGroup',
    props: {
        multiple: {
            type: Boolean,
            required: false,
            default: false
        },
        defaultValues: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            values: [],
            options: []
        }
    },
    provide() {
        return {
            groupContext: this
        }
    },
    emits: ['change'],
    watch: {
        'values': function (value) {
            console.log(value);
            this.$emit('change', value)
            // // 此条件是为解决单选时，触发两次chang事件问题
            // if (!(newVal.length === 1 && oldVal.length === 1 && newVal[0] === oldVal[0])) {
            //   this.$emit('change', this.values)
            // }
        }
    },
    methods: {
        handleChange(option) {
            if (!option.checked) {
                if (this.values.indexOf(option.value) > -1) {
                    this.values = this.values.filter(item => item != option.value)
                }
            } else {
                if (!this.multiple) {
                    this.values = [option.value]
                    this.options.forEach(item => {
                        if (item.value != option.value) {
                            item.sChecked = false
                        }
                    })
                } else {
                    this.values.push(option.value)
                }
            }
        }
    },
    render() {
        return <div style='display: flex'>{this.$slots.default()}</div>
    }
}
