<template>
  <el-collapse v-model="activeNames" style="margin-top: 10px;">
    <el-collapse-item title="专家抽取申请详情" name="1">
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="companyFromData"
        :rules="companyFromRules"
        disabled
      >
        <el-form-item label="企业名称：" prop="companyName">
          <el-input v-model="companyFromData.companyName" maxlength="100"/>
        </el-form-item>
        <el-form-item label="企业logo：" prop="companyLogo">
          <img :src="companyFromData.companyLogo" class="avatar" style="height: 100px">
        </el-form-item>
        <el-form-item label="企业类型：" prop="companyType">
          <el-select
            v-model="companyFromData.companyType"
            placeholder="请选择企业类型"
            clearable
            filterable
          >
            <el-option
              v-for="({value, key}) in optionMap.CompanyTypeEnum"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模：" prop="companySize">
          <el-input v-model="companyFromData.companySize" maxlength="100"/>
        </el-form-item>
        <el-form-item label="企业地址：" prop="companyAddress">
          <el-input v-model="companyFromData.companyAddress" maxlength="200"/>
        </el-form-item>
        <el-form-item label="企业介绍：" prop="companyIntroduction">
          <el-input v-model="companyFromData.companyIntroduction" type="textarea" maxlength="1000" show-word-limit/>
        </el-form-item>
      </el-form>
    </el-collapse-item>

    <el-collapse-item title="岗位信息" name="2">
      <g-table
        v-model="pageBean"
        v-loading="tableLoading"
        height="630px"
        :is-full="false"
        border
        order
        :columns="column"
        :data="tableData"
        class="hasAlertTable"
        @change="getList"
        @search-icon-click="getList"
      >
        <div slot="header">
          <div>
            <el-button
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click="handleClose(true)"
            >
              <span class="glz_newAdd glz_newAdd_lR"/>新增岗位
            </el-button>
            <!--            <el-form inline class="form-inline" @submit.native.prevent>-->
            <!--              <el-form-item label="企业类型：">-->
            <!--                <el-select placeholder="请选择" v-model="fromData.companyType" clearable filterable>-->
            <!--                  <el-option-->
            <!--                    v-for="({value, key}) in optionMap.CompanyTypeEnum"-->
            <!--                    :key="key"-->
            <!--                    :label="value"-->
            <!--                    :value="key"-->
            <!--                  ></el-option>-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <!--            </el-form>-->
          </div>
        </div>
      </g-table>
    </el-collapse-item>

    <el-dialog
      v-loading="loadingAdd"
      append-to-body
      title="新增岗位"
      :visible.sync="showAdd"
      width="70%"
      :before-close="() => handleClose(false)"
    >
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="fromData"
        :rules="fromRules"
        :disabled="isViewPosition"
      >

        <el-form-item label="岗位名称：" prop="positionName">
          <el-input v-model="fromData.positionName" maxlength="100"/>
        </el-form-item>

        <el-form-item label="岗位状态：" prop="positionType">
          <el-radio-group v-model="fromData.positionType">
            <el-radio label="0">停止</el-radio>
            <el-radio label="1">招聘</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="薪资范围：" prop="salaryRange">
          <el-input v-model="fromData.salaryRange" maxlength="100"/>
        </el-form-item>

        <el-form-item label="学历要求：" prop="educationRequirement">
          <el-select
            v-model="fromData.educationRequirement"
            placeholder="请选择企业类型"
            clearable
            filterable
          >
            <el-option
              v-for="({value, key}) in optionMap.EducationRequirementEnum"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="招聘人数：" prop="recruitmentNumber">
          <el-input v-model.number="fromData.recruitmentNumber" maxlength="100"/>
        </el-form-item>

        <el-form-item label="岗位亮点：" prop="highlight">
          <el-input v-model="fromData.highlight" maxlength="100"/>
        </el-form-item>

        <el-form-item label="岗位说明：" prop="positionDescription">
          <el-input v-model="fromData.positionDescription" type="textarea" maxlength="1000" show-word-limit/>
        </el-form-item>

        <el-form-item label="岗位职责：" prop="responsibilities">
          <el-input v-model="fromData.responsibilities" type="textarea" maxlength="1000" show-word-limit/>
        </el-form-item>

        <el-form-item label="岗位要求：" prop="requirements">
          <el-input v-model="fromData.requirements" type="textarea" maxlength="1000" show-word-limit/>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isViewPosition" @click="confirm">确定</el-button>
        <el-button @click="handleClose(false)">取消</el-button>
      </span>
    </el-dialog>
  </el-collapse>
</template>

<script>
import {getLabelByEquals} from '@/utils'
import GTable from '@/components/table/index.vue'
import moment from 'moment/moment'

export default {
  name: 'CompanyInfo',
  components: {
    GTable
  },
  data(that) {
    var validatePass1 = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error('请输入数字'))
        return
      }
      if (Number(value) <= 0 || !/^\d+$/g.test(value)) {
        callback(new Error('请输入大于0的整数数字'))
        return
      }
      callback()
    }

    return {
      activeNames: ['1', '2'],
      loading: false,
      companyFromData: {
        companyName: '', // 企业名称1
        companyLogo: '', // 企业logo
        companyAddress: '', // 企业地址
        companySize: '', // 企业规模
        companyIntroduction: '', // 企业介绍
        companyType: '' // 企业类型
      },
      companyFromRules: {
        companyName: {required: true, message: '请输入企业名称', trigger: 'blur'},
        companyLogo: {required: true, message: '请上传企业logo', trigger: 'blur'},
        companyAddress: {required: true, message: '请输入企业地址', trigger: 'blur'},
        companySize: {required: true, message: '请输入企业规模', trigger: 'blur'},
        companyType: {required: true, message: '请选择企业类型', trigger: 'blur'},
        companyIntroduction: {required: true, message: '请输入企业介绍', trigger: 'blur'}
      },

      tableLoading: false,
      column: [
        {
          prop: 'positionName',
          'show-overflow-tooltip': true,
          label: '岗位名称'
        },
        {
          prop: 'educationRequirement',
          'show-overflow-tooltip': true,
          label: '学历要求',
          render(h, scope, column) {
            const {educationRequirement} = scope.row

            // optionMap.EducationRequirementEnum
            return h(
              'span',
              getLabelByEquals(that.optionMap.EducationRequirementEnum, (item) => item.key === educationRequirement)
            )
          }
        },
        {
          width: 100,
          prop: 'recruitmentNumber',
          'show-overflow-tooltip': true,
          label: '招聘人数'
        },
        {
          prop: 'salaryRange',
          'show-overflow-tooltip': true,
          label: '薪资范围'
        },
        {
          prop: 'positionType',
          'show-overflow-tooltip': true,
          label: '岗位状态',
          render(h, {row}) {
            return h('span', {
              style: {
                color: row.positionType === '1' ? '#67C23A' : '#cb1e1e'
              }
            }, row.positionType === '1' ? '招聘中' : '已停止')
          }
        },
        {
          prop: 'createDate',
          'show-overflow-tooltip': true,
          label: '创建时间',
          formatter({row}) {
            return moment(row.createDate).format('yyyy-MM-DD HH:mm:SS')
          }
        },
        {
          prop: '',
          'show-overflow-tooltip': true,
          label: '操作',
          render(h, scope, column) {
            return [
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click() {
                      that.viewPosition(scope.row)
                    }
                  }
                },
                '查看'
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click() {
                      that.updatePosition(scope.row)
                    }
                  }
                },
                '修改'
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click() {
                      that.deletePosition(scope.row)
                    }
                  }
                },
                '删除'
              )
            ]
          }
        }
      ],
      tableData: [],
      pageBean: {
        count: 10,
        page: 1,
        pageSize: 10,
        searchName: ''
      },

      loadingAdd: false,
      showAdd: false,
      fromData: {
        positionName: '',
        positionType: '1',
        positionDescription: '',
        recruitmentNumber: '',
        salaryRange: '',
        highlight: '',
        responsibilities: '',
        requirements: '',
        educationRequirement: ''
      },
      fromRules: {
        positionName: {required: true, message: '请输入岗位名称', trigger: 'blur'},
        positionType: {required: true, message: '请输入岗位状态', trigger: 'blur'},
        educationRequirement: {
          required: true, message: '请选择学历要求', trigger: ['blur', 'change']
        },
        recruitmentNumber: [
          {required: true, message: '请输入岗位招聘人数', trigger: 'blur'},
          {validator: validatePass1, trigger: 'blur'}
        ],
        salaryRange: {required: true, message: '请输入岗位薪资范围', trigger: 'blur'},
        highlight: {required: true, message: '请输入岗位亮点', trigger: 'blur'},
        positionDescription: {required: true, message: '请输入岗位说明', trigger: 'blur'},
        responsibilities: {required: true, message: '请输入岗位职责', trigger: 'blur'},
        requirements: {required: true, message: '请输入岗位要求', trigger: 'blur'}
      },
      isViewPosition: false
    }
  },
  computed: {
    optionMap() {
      return this.$store.state.settings.optionMap
    },
    companyID() {
      return this.$route.query.companyID
    }
  },
  created() {
    this.getCompanyInfo()
    this.getList()
  },
  methods: {
    // 获取企业信息
    async getCompanyInfo() {
      try {
        this.loading = true
        const {data, code, message} = await this.$http.get('/jobApplication/getCompaniesByCompanyID', {
          params: {
            companyID: this.companyID
          }
        })
        if (code === 200) {
          this.companyFromData = data;
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async getList() {
      try {
        this.tableLoading = true
        const {pageSize, page: pageNumber} = this.pageBean
        const {data, code, message} = await this.$http.post('/jobApplication/getPositionList', {
          companyID: this.companyID,
          pageSize,
          pageNumber: pageNumber
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

    /** 新增岗位 */
    handleClose(boo) {
      if (boo === false) {
        this.$refs.form.clearValidate()
        setTimeout(() => {
          this.isViewPosition = false;
          this.fromData = {
            positionName: '',
            positionType: '1',
            positionDescription: '',
            recruitmentNumber: '',
            salaryRange: '',
            highlight: '',
            responsibilities: '',
            requirements: '',
            educationRequirement: ''
          };
        }, 100)
      }
      this.showAdd = boo
    },

    // 提交
    async confirm() {
      try {
        this.loadingAdd = true
        await this.$refs.form.validate()
        const isUpdate = !!this.fromData.positionID
        const url = `/jobApplication/${isUpdate ? 'updatePosition' : 'addPosition'}`
        let _data = this.fromData
        if (!isUpdate) {
          _data = {
            ...this.fromData,
            companyID: this.companyID
          }
        }

        const {code, message} = await this.$http.post(url, _data)
        if (code === 200) {
          this.handleClose(false)
          this.$message.success(`${isUpdate ? '修改' : '新增'}岗位成功`)
          this.getList()
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingAdd = false
      }
    },

    async updatePosition(row) {
      this.fromData = row
      this.handleClose(true)
    },

    async viewPosition(row) {
      this.isViewPosition = true
      this.fromData = row
      this.handleClose(true)
    },
    deletePosition(row) {
      this.$confirm('是否确认删除该岗位？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const {code, message} = await this.$http.get('/jobApplication/removePosition', {
            params: {
              positionID: row.positionID
            }
          })
          if (code === 200) {
            this.$message.success('删除岗位成功')
            this.getList()
          } else {
            this.$message.warning(message)
          }
        } catch (e) {
          console.error(e)
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
