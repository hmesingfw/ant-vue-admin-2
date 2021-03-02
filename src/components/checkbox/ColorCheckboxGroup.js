import { h } from 'vue'
export default {
    name: 'ColorCheckboxGroup',
    props: {
        defaultValues: {
            type: Array,
            required: false,
            default: () => []
        },
        multiple: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            values: [],
            options: []
        }
    },
    computed: {
        colors() {
            const colors = []
            this.options.forEach(item => {
                if (item.sChecked) {
                    colors.push(item.color)
                }
            })
            return colors
        }
    },
    provide() {
        return {
            groupContext: this
        }
    },
    watch: {
        values(value) {
            this.$emit('change', value, this.colors)
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
        const clear = h('div', { attrs: { style: 'clear: both' } })
        return h(
            'div',
            {},
            [this.$slots.default(), clear]
        )
    }
}
