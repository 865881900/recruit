<template>
<div class="glo-table-wrapper" ref="wraper">
    <!-- 表格头部 -->
    <div class="glo-table-wrapper__header" id="header" ref='header' v-if='$slots.header || hasSearch'>
        <div v-if='hasSearch' class="glo-table-wrapper__search" style="text-align: right">
            <el-input v-model="pagination.searchName" @keyup.enter.native="handleEnter"  :placeholder="placeholderText">
                <el-button @click='handleClick' type="primary" slot="append"  icon="el-icon-search">
                </el-button>
            </el-input>
        </div>
        <div class="countBox" v-if="showCount && type === 'selection'">
            已选择：{{checked.length}}个
        </div>
        <div class="glo-table-wrapper__form" v-if="$slots.header">
            <slot name='header'></slot>
        </div>
    </div>
    <!-- 表格内容 -->
    <div class="glo-table-wrapper__body" ref='body' id="body" :style="{'height': bodyHeight}" :class="{'not-full-scroll': !isFull}">
        <el-table :stripe="$attrs.stripe !== false" style="width: 100%" ref='table' :height='isFull ? "100%" : height' :data="flatData(data)" v-bind='$attrs' v-on='$listeners' @selection-change="selectionChange" :row-key='rowKey'>
            <template v-if="empty" slot="empty">
                {{emptyValue}}
            </template>
            <template v-if="!customScroll">
                <el-table-column :class-name='disabledIsSelected ? "selectArea" : ""' v-if='type && type !=="radio"' align='center' width="50" :type="type" :label='label'
                    :selectable="type === 'selection' ? selectable : ()=> true" :reserve-selection='type === "selection"'  :fixed="fixedLeft"
                ></el-table-column>

                <el-table-column :class-name='disabledIsSelected ? "selectArea" : ""' v-if='type === "radio"' align='center' :width="selectWidth" :type="type" :label='selectLabel' :fixed="fixedLeft">
                    <template slot-scope="scope">
                        <el-radio v-model="radioValue" @change='handleRadioChange(scope.row[radioProp], scope.row)' :label='scope.row[radioProp]' :disabled="selectable ? selectable(scope.row[radioProp]): scope.row.disabled"></el-radio>
                    </template>
                </el-table-column>

                <el-table-column v-if='order' label='序号' width="50" :fixed="fixedLeft" align="center">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>

                <!-- 表格主要内容 -->
                <g-column v-for='(column, index) in columns' :show-overflow-tooltip="column['show-overflow-tooltip']" :key='column.prop + column.label + index' v-bind='column' :align='column.align' :label-class-name="column.labelClass">
                </g-column>

                <el-table-column v-if='panel && Object.keys(panel).length' :width='panelWidth' label='操作' :fixed="fixedRight?'right':false" :align='operationAlign'>
                    <template slot-scope="scope">
                        <el-button-group class="glo-table__panel" :style="{width:panelWidth, wordWrap: 'nowrap', whiteSpace:'nowrap'}">
                            <el-button v-for='btn in scope.row.pageOpers || []' :key='btn.code' v-bind='filterPanel(btn)' @click="handleButtonClick(btn, scope)" type="text">{{btn.title && btn.title.replace(/核验/g,checkText)}}</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </template>
            <slot></slot>
        </el-table>
    </div>
    <!-- 表格底部 默认分页 -->
    <div class="glo-table-wrapper__footer" ref="footer" v-if='isPagination'>
      <el-pagination class="glo-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.count == 0 ? 0 : pagination.page" :page-sizes="pageSizes" :page-size="pagination.pageSize" :total="pagination.count || pagination.total || 0" layout="total, sizes, prev, pager, next, jumper" />
    </div>
</div>
</template>
<script>

export function debounce(fn, wait = 60) {
  var timeout = null;
  return function () {
    const arg = arguments
    if(timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout( () => fn.apply( this, arg), wait);
  }
}
import { mapState } from 'vuex'
const getState = function(state1, state2) { // 增加容缺核验状态逻辑，只有容缺不通过的时候，状态样式和原有项目核验不通过一致
    if(!state2 || state2 === 'undefined') { // 非容缺节点的核验
        return state1;
    }
    if(state1 === 'PASSED') {
        if(state2 === 'SAVED') {
            return state1;
        }
        if(state2 === 'NOPASSED' || state2 === 'COMMITTED' || state2 === 'APPROVING'){
            return state2;
        }
        return state1;
    }
    return state1;
}
export default {
    name: 'GTable',
    inheritAttrs: false,
    model: {
        prop: 'pagination',
        event: 'change'
    },
    data() {
        return {
            bodyHeight: 0,
            buttonGroup: [],
            searchName: '',
            radioValue: '',
            observer: null,
            recordValue: '',
            approvalProps: ['verificationStatus', 'state', 'status', 'noticeStatus', 'approveStatus'],
            checked: [],
        }
    },

    watch: {
        // searchName(val) {
        //     this.hasSearch && !val && this.$emit(
        //         'change', {
        //             ...this.pagination,
        //             page: 1,
        //             searchName: val
        //         }
        //     )
        // },

        data(tableData) {
            if (this.searchName) return;

            !tableData.length &&
                this.pagination.page > 1 &&
                this.handleCurrentChange(
                    this.pagination.page - 1
                );
        },
        height(nH, oH) {
            this.onResize();
        },
    },
    computed: {
        ...mapState('checkStatus',['checkText', 'checkStatusMapData']),
        placeholderText() {
            return this.placeholder ? (this.placeholder.indexOf('请输入') < 0  ? ('请输入'+this.placeholder) : this.placeholder) : '请输入';
        }
    },
    components: {
        GCell: {  //单元格渲染
            functional: true,
            props: {
                scope: Object,
                column: {
                    type: Object,
                    required: true,
                    default () {
                        return {}
                    }
                }
            },
            render: (h, ctx) => {
                const {
                    scope,
                    column
                } = ctx.props;
                const {
                    render,
                    formatter = ctx.parent.format
                } = column;
                return typeof render === 'function' ?
                    render(h, scope, column) :
                    h(
                        'span',
                        {class: [ctx.parent.isApprovalColumn(column.prop) && 'approval' + getState(scope.row[column.prop], scope.row.attachToleranceStatus), column.numberAlignment && 'is-numberAlignment']},
                        formatter(scope, column) || '--'
                    )
            }
        },

        GColumn: { //传入数据
            functional: true,
            render(h, ctx) {
                const children = ctx.props.children || [];
                const renderCell = function render(scope, column) {
                    return h(
                        'g-cell', {
                            props: {
                                scope,
                                column
                            }
                        },
                        []
                    )
                }
                if (ctx.parent.isApprovalColumn(ctx.props.prop) && !ctx.props.label) {
                    ctx.props.label = ctx.parent.checkText + '状态'
                }
                return h(
                    'el-table-column', {
                        ...ctx,
                        scopedSlots: {
                            default (scope) {
                                return renderCell(scope, ctx.props)
                            }
                        }
                    },

                    children.length && children.map(item => h(
                        'g-column', {
                            props: item,
                            scopedSlots: {
                                default (scope) {
                                    return renderCell(scope, item);
                                }
                            }
                        }
                    ))
                )
            }
        }
    },

    props: {
        fixedLeft:{//是否左浮动定位
            type:Boolean,
            default:false
        },
        fixedRight:{//是否右浮动定位
            type:Boolean,
            default:false
        },
        operationAlign:{//操作列对齐方式
            type:String,
            default:'left'
        },
        labelClass:{//列标题类名
            type:String,
            default:''
        },
        customScroll:{//自定义左右滚动效果，true:页面单独渲染tabel  false:默认渲染
            type:Boolean,
            default:false
        },
        empty: {//是否显示自定义提示
            type: Boolean,
            default:false
        },
        emptyValue: { //自动定义提示内容
            type: String,
            default:"暂无数据"
        },
        // 列配置项
        columns: {
            type: Array,
            default () {
                return []
            },
            required: true
        },

        // 复选框必选参数
        rowKey: {
            type: String,
            default: 'index'
        },

        radioProp: String,
        order: {
            type: Boolean,
            default: false
        },

        hasSearch: {
            type: Boolean,
            default: false
        },

        placeholder: {
            type: String,
            default: ''
        },

        selectable: Function,

        height: [String, Number],

        // 是否一屏
        isFull: {
            type: Boolean,
            default: true
        },

        // 表格栏首列类型
        type: String,
        showCount: {
            type: Boolean,
            default: false
        },
        // 列名
        label: {
            type: String,
            default: '序号'
        },
        //单选复选列宽度
        selectWidth: {
            type: String,
            default: '50px'
        },

        //单选复选列列名
        selectLabel: {
            type: String,
            default: '单选'
        },

        // 操作按钮栏宽度
        panelWidth: {
            type: String,
            default: '150px'
        },

        // 表格操作栏按钮
        panel: {
            type: Object,
            default () {
                return {}
            }
        },

        // 禁用时增加选中样式
        disabledIsSelected: {
            type: Boolean,
            default: false
        },

        // 表格数据
        data: {
            type: Array,
            default () {
                return []
            },
            required: true
        },

        // 是否显示分页
        isPagination: {
            type: Boolean,
            default: true
        },
        // 每页显示
        pageSizes: {
            type: Array,
            default () {
                return [10, 20, 30, 100]
            }
        },

        // 分页信息
        pagination: {
            type: Object,
            default () {
                return {
                    pageSize: 10,
                    total: 0,
                    page: 1,
                  pageCount: 0
                }
            }
        },
    },

    methods: {
        selectionChange(selected){
          console.log(selected)
          this.checked = selected
            this.$emit('selectionChange',selected)
        },
        format(scope, column) {
            if (this.isApprovalColumn(column.prop)) {
                let map = this.checkStatusMapData.commonApprovalMap
                const {
                    meta
                } = this.$route
                if (meta && meta.isApprovalList) {
                    map = this.checkStatusMapData.checkApprovalMap
                }
                return map[scope.row[column.prop || column.property]]
            }else{
                return scope.row[column.prop || column.property]
            }
        },
        isApprovalColumn(prop){
            return this.approvalProps.includes(prop)
        },
        handleRadioChange(val, row) {
            this.$emit('radio-change', val, row)
        },

        clearRadio() {
            this.radioValue = '';
        },

        filterPanel(option = {}) {
            const {
                code,
                text,
                onClick,
                title,
                pageOpers,
                ...prop
            } = option;
            return prop
        },

        handleSizeChange(num) {
            this.$emit('change', {
                ...this.pagination,
                page: 1,
                // searchName: this.searchName,
                pageSize: num
            })
        },

        handleCurrentChange(num) {
            this.$emit('change', {
                ...this.pagination,
                // searchName: this.searchName,
                page: num
            })
        },

        handleSearchChange(searchName) {
            // this.searchName = searchName;
            // this.$emit('change', {
            //     ...this.pagination,
            //     page: 1,
            //     searchName
            // })
        },
        handleButtonClick(it, scope) {
            const panel = this.panel;
            if (!panel.hasOwnProperty(it.code)) {
                return console.error(`属性为${it.code}的按钮权限未注册`);
            }
            const callback = typeof panel[it.code] === 'function' ? panel[it.code] : panel[it.code].onClick;
            typeof callback === 'function' && callback(scope, this)
        },

        onResize() { //获取表格高度
            if (!this.isFull) return;
            const wraperHeight = this.$refs.wraper.clientHeight
            const headerHeight = this.$refs.header ? this.$refs.header.offsetHeight : 0
            const footerHeight = this.$refs.footer ? this.$refs.footer.offsetHeight : 0
            const subHeight = headerHeight + footerHeight + 20
            this.bodyHeight = wraperHeight - subHeight + 'px'
        },

        initReset() { //防抖判断
            if (!this.isFull) return;
            this.handleResize = debounce(this.onResize, 60);
        },

        flatData(arr = []) {
            return arr.map(item => {
                const {
                    data,
                    pageOpers
                } = item;
                return (data ? {
                    ...data,
                    pageOpers
                } : item) || {};
            })
        },

        handleEnter() {
            this.$emit(
                'enter', {
                    ...this.pagination,
                    page: 1,
                    // searchName: this.searchName
                }
            );
        },

        handleClick() {
            this.$emit(
                'search-icon-click', {
                    ...this.pagination,
                    page: 1,
                    // searchName: this.searchName
                }
            )
        }
    },

    created() {
        this.initReset();
    },

    mounted() {
      if (this.isFull) {
            this.onResize();
            const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
            this.$nextTick(() => {
                const header = document.querySelector('#ui-header')
                this.observer = new MutationObserver(() => {
                    let height = header.offsetHeight
                    if (this.recordValue && height === this.recordValue) return
                    this.recordValue = height
                    this.onResize()
                })
                this.observer.observe(header, { attributes: true, childList: true, subtree: true })
            })

            window.addEventListener('resize', this.handleResize)
        }else{
            this.bodyHeight = this.height
                ? this.height.endsWith('px')
                    ? this.height
                    : this.height + 'px'
                : 'calc(100% - 85px)'
        }
    },

    beforeDestroy() {
        this.isFull && window.removeEventListener('resize', this.handleResize)
        if (this.observer) {
            this.observer.disconnect()
            this.observer.takeRecords()
            this.observer = null
        }
    }
}
</script>

<style lang="scss" scoped>
@import "element-ui/packages/theme-chalk/src/mixins/mixins.scss";
@import "../../assets/scss/var.scss";
@include b(table-wrapper) {

    height: 100%;
    background: #fff;
    box-sizing: border-box;
    // padding: 10px;

    @include e(header) {
        @include clearBoth;
        padding: 10px 0;
        padding-top: 0;
        .countBox{
            float: left;
            margin-top: 12px;
        }
    }

    @include e(search) {
        float: right;
        text-align: right;
        // margin-right: 3px;
        // margin-left: 5px;
    }

    @include e(form) {
        overflow: hidden;

        & :deep(.el-form-item) {
            margin-bottom: 0;
            margin-right: 20px;
        }
    }

    @include e(body) {
        height: calc(100% - 85px);

        // .el-table{
        //     height: 100%!important;
        //     min-height: 500px;
        // }
        & .el-button {
            margin-right: 3px;
        }

        & .el-button:last-child {
            margin-right: 0;
        }

        & :deep(.el-radio) {
            margin-right: 0;

            & .el-radio__label {
                display: none;
            }
        }

        & :deep(.el-table__body-wrapper) {
            -ms-overflow-style: scrollbar;
        }
    }

    @include e(footer) {
        // height: 40px;
        // line-height: 40px;
        padding-top: 20px;
        text-align: center;
        padding-bottom: 10px;
    }
}
.not-full-scroll {
  overflow-y: auto;
}
/* 整个滚动条 */
.not-full-scroll::-webkit-scrollbar {
    /* 对应纵向滚动条的宽度 */
    width: 6px;
    /* 对应横向滚动条的宽度 */
    height: 6px;
}
/* 滚动条上的滚动滑块 */
.not-full-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(51, 51, 51, 0.3);
    border-radius: 6px;
}
/* 滚动条轨道 */
.not-full-scroll::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 6px;
}
//
//@include b(pagination) {
//    display: inline-block;
//    padding: 0;

//}
</style>
<style lang="scss">
.g-form.el-form--inline {
    .el-form-item{
        width: 100%;
    }
    .el-form-item__content{
        overflow: hidden;
        display: block;
    }
    .el-input-group{
        box-sizing: border-box;
    }
}
.approvalCOMMITTED, .approvalAPPROVING, .approvalABOLISH{
    width: auto;
    height: auto;
    padding: 6px 5px;
    font-size: 12px;
    border-radius: 1px;
    border: 1px solid;
    background-color: #e8f4ff;
    border-color: #1890ff;
    color: #1890ff;
}
.approvalPASSED, .approvalREPLY {
    width: auto;
    height: auto;
    padding: 6px 5px;
    font-size: 12px;
    border-radius: 1px;
    border: 1px solid;
    background-color: #eef7e8;
    border-color: #57b21c;
    color: #57b21c;
}
.approvalNOPASSED, .approvalRETURNED, .approvalRETURNBACK {
    width: auto;
    height: auto;
    padding: 6px 5px;
    font-size: 12px;
    border-radius: 1px;
    border: 1px solid;
    background-color: #fdeaea;
    border-color: #e82f2f;
    color: #e82f2f;
}
.approvalSAVED {
    width: auto;
    height: auto;
    padding: 6px 5px;
    font-size: 12px;
    border-radius: 1px;
    border: 1px solid;
    background-color: #fff4e6;
    border-color: #fc9306;
    color: #fc9306;
}
.selectArea{
    .cell{
        padding: 0 !important;
        label{
            width: 100%;
        }
        .is-disabled{
            .el-checkbox__inner::before{
                box-sizing: content-box;
                content: "";
                border: 1px solid #666;
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 4px;
                position: absolute;
                top: 1px;
                transform: rotate(45deg) scaleY(1);
                width: 3px;
                transition: transform .15s ease-in .05s;
                transform-origin: center;
            }
        }
    }
}
.disabledRow.el-table__row{
    td{
        .cell{
            color: #888;
        }
    }
}
.disabledAll.el-table__column{
    .el-checkbox__inner{
        background-color: #efefef;
        border-color: #999;
        cursor: not-allowed;
        &::before{
            display: none;
        }
        &::after{
            display: none;
        }
    }
}
.is-numberAlignment {
    text-align: right;
    display: inherit;
}
</style>
