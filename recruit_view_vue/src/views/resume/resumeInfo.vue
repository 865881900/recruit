<template>
  <el-collapse v-model="activeNames" style="margin-top: 10px;">
    <el-collapse-item title="企业信息" name="1">
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="companyFromData"
        disabled
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="companyName">
              <el-input v-model="companyFromData.companyName" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="岗位信息" name="2">
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="positionFromData"
        disabled
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="岗位名称：" prop="positionName">
              <el-input v-model="positionFromData.positionName" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位状态：" prop="positionType">
              <el-radio-group v-model="positionFromData.positionType">
                <el-radio label="0">停止</el-radio>
                <el-radio label="1">招聘</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="薪资范围：" prop="salaryRange">
              <el-input v-model="positionFromData.salaryRange" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历要求：" prop="educationRequirement">
              <el-select
                v-model="positionFromData.educationRequirement"
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="招聘人数：" prop="recruitmentNumber">
              <el-input v-model.number="positionFromData.recruitmentNumber" maxlength="100"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>

    <el-collapse-item title="简历信息" name="1">
      <el-form
        ref="form"
        class="form-ui"
        label-width="100px !important"
        style="margin: 10px 20px 0"
        :model="companyFromData"
        disabled
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业名称：" prop="companyName">
              <el-input v-model="companyFromData.companyName" maxlength="100"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import GTable from '@/components/table/index.vue'

export default {
  name: 'ResumeInfo',
  components: {
    GTable
  },
  data(that) {
    return {
      // 企业信息
      companyFromData: {},
      // 岗位信息
      positionFromData: {},
      // 简历信息
      resumeFromData: {},

      activeNames: ['1', '2'],
      loading: false,
      loading1: false,
      loading2: false
    }
  },
  computed: {
    companyID() {
      return this.$route.query.companyID
    },

    applicationID() {
      return this.$route.query.companyID
    },

    resumeID() {
      return this.$route.query.resumeID
    },

    positionID() {
      return this.$route.query.positionID
    },

    optionMap() {
      return this.$store.state.settings.optionMap
    }
  },
  created() {
    this.getCompanyInfo()
    this.getPosition()
    this.getResume()
  },
  methods: {
    // 获取企业信息
    async getCompanyInfo() {
      try {
        this.loading = true
        const { data, code, message } = await this.$http.get('/jobApplication/getCompaniesByCompanyID', {
          params: {
            companyID: this.companyID
          }
        })
        if (code === 200) {
          this.companyFromData = data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    // 获取岗位信息
    async getPosition() {
      try {
        this.loading1 = true
        const { data, code, message } = await this.$http.get('/jobApplication/getPositionByPositionID', {
          params: {
            positionID: this.positionID
          }
        })
        if (code === 200) {
          this.positionFromData = data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading1 = false
      }
    },

    // 获取简历信
    async getResume() {
      try {
        this.loading2 = true
        const { data, code, message } = await this.$http.get('/jobApplication/getResumeByResumeID', {
          params: {
            resumeID: this.resumeID
          }
        })
        if (code === 200) {
          this.resumeFromData = data
        } else {
          this.$message.warning(message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading2 = false
      }
    }
  }
}
</script>

<style scoped>

</style>
