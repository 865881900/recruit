<template>
  <g-table
    v-model="pageBean"
    v-loading="tableLoading"
    border
    is-full
    order
    has-search
    placeholder="请输入企业名称"
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
          <span class="glz_newAdd glz_newAdd_lR" />新增企业
        </el-button>
        <el-form inline class="form-inline" @submit.native.prevent>
          <el-form-item label="企业类型：">
            <el-select v-model="fromData.companyType" placeholder="请选择" clearable filterable>
              <el-option
                v-for="({value, key}) in optionMap.CompanyTypeEnum"
                :key="key"
                :label="value"
                :value="key"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog
      v-loading="loadingAddCompany"
      append-to-body
      title="新增企业"
      :visible.sync="showAddCompany"
      width="70%"
      :before-close="() => handleClose(false)"
    >
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="companyFromData"
        :rules="companyFromRules"
      >
        <el-form-item label="企业名称：" prop="companyName">
          <el-input v-model="companyFromData.companyName" maxlength="100" />
        </el-form-item>
        <el-form-item label="企业logo：" prop="companyLogo">
          <el-upload
            class="avatar-uploader"
            action="/jobApplication/jobApplication/uploads"
            :show-file-list="false"
            :multiple="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="companyFromData.companyLogo" :src="companyFromData.companyLogo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="企业地址：" prop="companyAddress">
          <el-input v-model="companyFromData.companyAddress" maxlength="200" />
        </el-form-item>
        <el-form-item label="企业规模：" prop="companySize">
          <el-input v-model="companyFromData.companySize" maxlength="100" />
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
        <el-form-item label="企业介绍：" prop="companyIntroduction">
          <el-input v-model="companyFromData.companyIntroduction" type="textarea" maxlength="1000" show-word-limit />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="handleClose(false)">取消</el-button>
      </span>
    </el-dialog>
  </g-table>
</template>

<script>
import GTable from '../../components/table/index'
import { getLabelByEquals } from '@/utils'
import moment from 'moment'

export default {
  name: 'CompanyList',
  components: {
    GTable
  },
  data(that) {
    return {
      tableLoading: true,
      fromData: {
        companyType: ''
      },
      column: [
        {
          prop: 'companyName',
          'show-overflow-tooltip': true,
          label: '企业名称'
        },
        {
          prop: 'companyType',
          'show-overflow-tooltip': true,
          label: '企业类型',
          render(h, scope, column) {
            const { companyType } = scope.row
            return h(
              'span',
              getLabelByEquals(that.optionMap.CompanyTypeEnum, (item) => item.key === companyType)
            )
          }
        },
        {
          width: 100,
          prop: 'companyLogo',
          'show-overflow-tooltip': true,
          label: '企业logo',
          render(h, scope, column) {
            const { companyLogo } = scope.row
            return h('img', {
              attrs: {
                src: companyLogo
              },
              style: {
                width: '20px',
                height: '20px'
              }
            })
          }
        },
        {
          prop: 'companyAddress',
          'show-overflow-tooltip': true,
          label: '企业地址'
        },
        {
          prop: 'companySize',
          'show-overflow-tooltip': true,
          label: '企业规模'
        },
        {
          prop: '',
          'show-overflow-tooltip': true,
          label: '企业招聘岗位',
          formatter({ row }) {
            return row.positionList.length || '0'
          }
        },
        {
          prop: 'createDate',
          'show-overflow-tooltip': true,
          label: '创建时间',
          formatter({ row }) {
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
                      that.toCompanyInfo(scope.row)
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
                      that.update(scope.row)
                    }
                  }
                },
                '修改'
              )
            ]
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

      loadingAddCompany: false,
      showAddCompany: false,
      companyFromData: {
        companyName: '', // 企业名称1
        companyLogo: '', // 企业logo
        companyAddress: '', // 企业地址
        companySize: '', // 企业规模
        companyIntroduction: '', // 企业介绍
        companyType: '' // 企业类型
      },
      companyFromRules: {
        companyName: { required: true, message: '请输入企业名称', trigger: 'blur' },
        companyLogo: { required: true, message: '请上传企业logo', trigger: 'blur' },
        companyAddress: { required: true, message: '请输入企业地址', trigger: 'blur' },
        companySize: { required: true, message: '请输入企业规模', trigger: 'blur' },
        companyType: { required: true, message: '请选择企业类型', trigger: ['blur', 'change'] },
        companyIntroduction: { required: true, message: '请输入企业介绍', trigger: 'blur' }
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
        this.getList();
      }
    }
  },
  methods: {

    async getList() {
      try {
        this.tableLoading = true
        const { searchName: companyName, pageSize, page: pageNumber } = this.pageBean
        const { companyType } = this.fromData
        const { data, code, message } = await this.$http.post('/jobApplication/getCompanyList', {
          companyType,
          companyName,
          pageSize,
          pageNumber
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
        path: '/company/companyInfo',
        query: {
          companyID: row.companyID
        }
      })
    },

    /** 新增企业 */
    handleClose(boo) {
      if (boo === false) {
        this.$refs.form.clearValidate()
        this.companyFromData = {
          companyName: '', // 企业名称1
          companyLogo: '', // 企业logo
          companyAddress: '', // 企业地址
          companySize: '', // 企业规模
          companyIntroduction: '', // 企业介绍
          companyType: '' // 企业类型
        }
      }
      this.showAddCompany = boo
    },
    update(row) {
      this.handleClose(true)
      this.companyFromData = row
    },
    // 提交
    async confirm() {
      try {
        this.loadingAddCompany = true
        await this.$refs.form.validate()
        const url = `${this.companyFromData.companyID ? '/jobApplication/updateCompany' : '/jobApplication/addCompany'}`
        const { code, message } = await this.$http.post(url, {
          ...this.companyFromData
        })
        if (code === 200) {
          this.handleClose(false)
          this.$message.success('创建成功')
          this.getList()
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingAddCompany = false
      }
    },
    handleAvatarSuccess(res, file) {
      this.companyFromData.companyLogo = `${process.env.VUE_APP_BASE_API}/jobApplication/download?filename=${res.data.path}`
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpeg'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
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
