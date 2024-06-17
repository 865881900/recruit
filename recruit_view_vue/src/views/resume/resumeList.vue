<template>
  <g-table
    type="selection"
    v-model="pageBean"
    @selectionChange="selectionChange"
    rowKey="applicationID"
    v-loading="tableLoading"
    border
    is-full
    order
    has-search
    placeholder="请输入简历编号"
    :columns="column"
    :data="tableData"
    class="hasAlertTable"
    @change="getList"
    @search-icon-click="getList"
  >
    <div slot="header">
      <div>
        <el-form inline class="form-inline" @submit.native.prevent>
          <el-form-item label="投递时间：">
            <el-date-picker
              v-model="fromData.date"
              style="width: 250px"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            />
          </el-form-item>
        </el-form>

        <el-form inline class="form-inline" @submit.native.prevent>
          <el-form-item label="岗位状态：">
            <el-select
              v-model="fromData.positionType"
              style="width: 130px"
              placeholder="请选择岗位状态"
              clearable
              filterable
            >
              <el-option label="招聘中" value="1"/>
              <el-option label="停止招聘" value="0"/>
            </el-select>
          </el-form-item>
        </el-form>

        <el-form inline class="form-inline" @submit.native.prevent>
          <el-form-item label="岗位：">
            <el-select
              v-model="fromData.positionID"
              style="width: 130px"
              :placeholder="!this.fromData.companyID ? '请先选择企业' : '请选择岗位'"
              clearable
              filterable
              :disabled="!this.fromData.companyID"
            >
              <el-option
                v-for="({positionName, positionID}) in positionList"
                :key="positionID"
                :label="positionName"
                :value="positionID"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form inline class="form-inline" @submit.native.prevent>
          <el-form-item label="企业：" :disabled="companyList.length === 0">
            <el-select
              v-model="fromData.companyID"
              placeholder="请选择企业"
              clearable
              filterable
              style="width: 130px"
              @change="getPositionList"
            >
              <el-option
                v-for="({companyName, companyID}) in companyList"
                :key="companyID"
                :label="companyName"
                :value="companyID"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </g-table>
</template>

<script>
import GTable from '../../components/table/index'
import moment from 'moment'
import axios from "axios";
// import { getLabelByEquals } from '@/utils'
// import moment from 'moment'

export default {
  name: 'ResumeList',
  components: {
    GTable
  },
  data(that) {
    return {
      tableLoading: true,
      fromData: {
        companyID: '', // 企业ID
        positionID: '', // 岗位id
        positionType: '', // 岗位状态
        date: []
      },
      column: [
        {
          prop: 'applicationKey',
          'show-overflow-tooltip': true,
          label: '投递编号'
        },
        {
          'show-overflow-tooltip': true,
          label: '投递企业',
          formatter({row}) {
            return row.company.companyName
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '投递岗位',
          formatter({row}) {
            return row.position.positionName
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '岗位状态',
          render(h, {row}) {
            return h('span', {
              style: {
                color: row.position.positionType === '1' ? '#67C23A' : '#cb1e1e'
              }
            }, row.position.positionType === '1' ? '招聘中' : '已停止')
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '姓名',
          formatter({row}) {
            return row.resume.name
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '性别',
          prop: 'gender',
          formatter({row}) {
            return row.resume.gender === '1' ? '男' : '女'
          }
        },
        {
          'show-overflow-tooltip': true,
          label: 'email',
          prop: 'email',
          formatter({row}) {
            return row.resume.email
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '手机号',
          prop: 'phoneNumber',
          formatter({row}) {
            return row.resume.phoneNumber
          }
        },
        {
          'show-overflow-tooltip': true,
          label: '微信号',
          prop: 'weChat',
          formatter({row}) {
            return row.resume.weChat
          }
        },
        {
          prop: 'createDate',
          'show-overflow-tooltip': true,
          label: '投递时间',
          formatter({row}) {
            return moment(row.createDate).format('yyyy-MM-DD HH:mm:ss')
          }
        },
        {
          prop: '',
          'show-overflow-tooltip': true,
          width: '150px',
          label: '操作',
          render(h, scope, column) {
            const buttonList = [
              {
                text: '查看详情',
                on: 'toResumeInfo',
                disabled: false,
              },
              {
                text: '下载简历',
                on: 'uploadResume',
                disabled: scope.row.createPdf === '0',
              }
            ]

            return buttonList.map(item => {
              return h(
                'el-button',
                {
                  props: {
                    type: 'text',
                    disabled: item.disabled
                  },
                  on: {
                    click() {
                      (that[item.on])(scope.row)
                    }
                  }
                },
                item.text
              )
            })
          }
        }
      ],
      tableData: [],
      pageBean: {
        count: 0,
        page: 1,
        pageSize: 10,
        searchName: '',
        companyType: ''
      },
      companyTypeList: [
        {
          value: 1,
          label: '1'
        }
      ],
      companyList: [],
      positionList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
      }
    }
  },
  computed: {
    optionMap() {
      return this.$store.state.settings.optionMap
    }
  },
  watch: {
    fromData: {
      deep: true,
      immediate: true,
      handler() {
        this.getList()
      }
    }
  },
  created() {
    this.getCompanyList()
  },
  methods: {
    async getList() {
      try {
        this.tableLoading = true
        const {searchName: applicationKey, pageSize, page: pageNumber} = this.pageBean
        const {companyID, positionID, date, positionType} = this.fromData
        const {data, code, message} = await this.$http.post('/jobApplication/getResumeList', {
          pageSize,
          pageNumber,
          applicationKey,
          companyID,
          positionID,
          positionType,
          startData: date && date[0],
          endData: date && date[1]
        })
        if (code === 200) {
          this.tableData = data.data
          this.pageBean.count = data.pageCount
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.tableLoading = false
      }
    },
    toCompanyInfo(row) {
      console.log('触发')
      this.$router.push({
        path: 'companyInfo',
        query: {
          companyID: row.companyID
        }
      })
    },
    // 返回所有的企业
    async getCompanyList() {
      try {
        const {data, code, message} = await this.$http.post('/jobApplication/getCompanyList', {
          companyType: '',
          companyName: '',
          pageSize: 10000,
          pageNumber: 1
        })
        if (code === 200) {
          this.companyList = data.data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      }
    },

    async getPositionList() {
      try {
        if (!this.fromData.companyID) {
          this.positionList = []
          this.fromData.positionID = ''
          return
        }

        const {data, code, message} = await this.$http.post('/jobApplication/getPositionList', {
          companyID: this.fromData.companyID,
          pageSize: 10000,
          pageNumber: 1
        })
        if (code === 200) {
          this.positionList = data.data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      }
    },

    selectionChange(list) {
      console.log(list)
    },

    // 查看详情
    toResumeInfo(row) {
      window.open(`${window.location.origin}/#/resumeInfo?applicationID=${row.applicationID}`, '_black')
      // this.$router.push({
      //   path: '/resumeInfo',
      //   query: {
      //     applicationID: row.applicationID,
      //   }
      // })
    },

    // 下载简历
    async uploadResume(row) {
      try {
        const fileName = row.applicationID + '.pdf';
        const {data, code, message} = await this.$http.get('/getFile/getFileUrl', {
          params: {
            applicationKey: fileName
          }
        })
        if (code !== 200) {
          this.$message.warning('获取下载地址错误');
          return
        }

        // 替换为你的OSS文件URL
        const pdfUrl = data.url;
        // 使用axios获取文件的响应体
        const response = await axios.get(pdfUrl, {responseType: 'blob'});

        // 创建Blob对象
        const blob = new Blob([response.data], {type: 'application/pdf'});

        // 创建隐藏的可下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${row.applicationKey}.pdf`; // 自定义文件名
        document.body.appendChild(link);

        // 触发点击
        link.click();

        // 清理URL和link元素
        URL.revokeObjectURL(link.href);
        link.remove();
      } catch (error) {
        console.error('下载PDF文件时发生错误:', error);
      }
    },
  }
}
</script>

<style scoped lang="scss">
.form-inline {
  float: right;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #8c939d;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

</style>
