<template>
  <view class="page">
    <!-- 应聘企业   -->
    <view class="card_index card">
      <view class="company-data">
        <image class="company-image" :src="company.companyLogo"/>
        <view class="company-message">
          <view class="company-title">
            {{ company.companyName }}
          </view>
          <view class="company-type">
            <view class="company-view">
              <image class="company-type-icon" src="../../static/icon/typeEmployee.png"></image>
              <view>
                类型：
                <view class="aaa">{{ companyType }}</view>
              </view>
            </view>
            <view class="company-view">
              <image class="company-type-icon" src="../../static/icon/numberEmployee.png"></image>
              <view>规模：
                <view class="aaa">{{ company.companySize }}</view>
              </view>
            </view>
          </view>
        </view>
        <image
          v-if="false"
          class="company-info" src="../../static/icon/right.png"/>
      </view>

      <view class="company-address">
        <image class="company-type-icon" src="../../static/icon/address.png"></image>
        <view>企业地址：{{ company.companyAddress }}</view>
      </view>
    </view>
    <!-- 企业详情   -->
    <view class="card_index card">
      <view class="card_title">企业详情</view>
      <view class="company-introduction">
        {{ company.companyIntroduction }}
      </view>
    </view>
    <!-- 在招岗位   -->
    <view class="job-openings-all">在招岗位</view>
    <view class="job-openings-not" v-if="!company.positionList">-- 招聘已结束 --</view>
    <view
      v-else
      class="card_index card"
      v-for="(item, index) in company.positionList"
      :key="item.positionID"
    >
      <view class="job-openings-title">{{ item.positionName }}</view>
      <view class="job-openings-pay">{{ item.salaryRange }}</view>
      <view
        class="job-openings_message"
        v-if="item.applicationKey"
      >
        投递编号：
        <span style="color: #409eff">{{ item.applicationKey }}</span>
      </view>
      <view class="job-openings_message">
        学历要求：
        <span class="aaa">
          {{ educationRequirement(item.educationRequirement) }}
        </span>
      </view>
      <view class="job-openings_message">
        招聘人数：
        <span class="aaa">
          {{ item.recruitmentNumber }}
        </span>
      </view>
      <view class="job-openings_message">
        岗位亮点：
        <span class="aaa">
          {{ item.highlight }}
        </span>
      </view>
      <view class="job-openings_message">
        岗位介绍：
        <span class="aaa">
          {{ item.positionDescription }}
        </span>
      </view>

      <view class="position-content" @click="setIsShowContent(index)" v-if="!item.isShowContent">
        查看详情
      </view>
      <view v-if="item.isShowContent">
        <view class="job-openings_message">
          岗位说明：
          <span class="aaa">
            {{ item.positionDescription }}
          </span>
        </view>

        <view class="job-openings_message">
          岗位职责：
          <span class="aaa">
            {{ item.responsibilities }}
          </span>
        </view>

        <view class="job-openings_message">
          岗位要求：
          <span class="aaa">
            {{ item.requirements }}
          </span>
        </view>
      </view>
      <view class="position-content" @click="setIsShowContent(index)" v-if="item.isShowContent">
        收起详情
      </view>
      <view class="job-openings-button">
        <button
          type="primary"
          :disabled="item.applicationKey"
          @click="goCurriculumVitae(item.positionID)">投递简历
        </button>
      </view>

    </view>
  </view>
</template>

<script>
import {API} from "@/utils/js/requectList";
import {HTTPURL} from "@/utils/js/config";
import {modelT, navBack} from "@/utils/js/utils";

export default {
  data() {
    return {
      company: {
        "companyID": '',
        "companyName": "",
        "companyLogo": "",
        "companyType": "",
        "companyAddress": "",
        "companySize": "",
        "companyIntroduction": "",
        positionList: undefined
      },
      typeEnum: undefined
    }
  },
  onLoad() {
    const companyID = uni.getStorageSync('companyID')
    this.companyID = companyID;
    this.getCompaniesByCompanyID(companyID);
    this.getEnumMap();
  },

  computed: {
    companyType() {
      return (this.typeEnum && this.typeEnum.CompanyTypeEnum.find(item => item.key === this.company.companyType) || {}).value;
    },
    educationRequirement() {
      return educationRequirement => {
        return (this.typeEnum && this.typeEnum.EducationRequirementEnum.find(item => item.key === educationRequirement) || {}).value;
      }
    }

  },
  methods: {
    //获取企业的详情
    async getCompaniesByCompanyID() {
      let userinfo = uni.getStorageSync('userinfo');
      userinfo = userinfo ? JSON.parse(userinfo) : {}

      let {data} = await API.getCompaniesByCompanyID({
        companyID: this.companyID,
        resumeID: userinfo.resumeID,
      });
      this.company = {
        ...data,
        companyLogo: HTTPURL + data.companyLogo,
        positionList: data.positionList.map(item => ({
          ...item,
          isShowContent: false
        }))
      }
    },
    async getEnumMap(companyID) {
      let {data} = await API.getEnumMap(companyID);
      this.typeEnum = data;
    },

    setIsShowContent(index) {
      const isOpenIndex = this.company.positionList.findIndex(item => item.isShowContent === true);

      this.company.positionList = this.company.positionList.map((item, _index) => {
        return {
          ...item,
          isShowContent: isOpenIndex === _index ? false : _index === index
        }
      })
    },


    async goCurriculumVitae(id) {
      let userinfo = uni.getStorageSync('userinfo');
      if (userinfo) {
        userinfo = JSON.parse(userinfo)
      }
      if (!userinfo.resumeID) {
        modelT('请完善您的简历');
        const ID = setTimeout(() => {
          uni.navigateTo({
            url: `/pages/resume/index`,
          })
          clearTimeout(ID)
        }, 600)
        return
      }
      const {data, code} = await API.addApplication({
        companyID: this.companyID,
        positionID: id,
        resumeID: userinfo.resumeID,
      });
      if (code === 301) {
        modelT('请完善您的建立')
        const ID = setTimeout(() => {
          uni.navigateTo({
            url: `/pages/resume/index`,
          })
          clearTimeout(ID)
        }, 600)
      } else {
        API.getP({
          applicationID: data.applicationID,
        });
        this.getCompaniesByCompanyID();
        modelT('投递成功');
      }
    },
    change(e, key, options) {
      const index = e.detail.value;
      this.basicInfo[key] = options[index].value;
    },
    getValue(options, key) {
      const item = options.find(item => item.value === this.basicInfo[key]);
      return item ? item.label : '请选择'
    },
  }
}
</script>

<style>

.card_index {
  margin: 10px;
}

.company-data {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(153, 153, 153, 0.49);
}

.company-image {
  height: 50px;
  width: 50px;
  margin-right: 10px;
  border-radius: 10%;
}

.company-message {
  width: calc(100% - 76px);
}

.company-title {
  font-size: 16px;
}

.company-type {
  display: flex;
  margin-top: 20px;
  color: #555555;
  font-size: 14px;
}

.company-type > view {
  width: 50%;
  display: inline-flex;
  align-items: center;
}

.company-view {
  width: calc(100% - 26px);
  word-wrap: break-word;
}

.company-type-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.company-info {
  margin: 2px 0 2px 5px;
  height: 14px;
  width: 14px;
  display: inline-block;
}


.company-address {
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
}


.title-h5 {
  height: 20px;
  font-size: 18px;
  color: #409eff;
  text-align: center;
}


.form-item {
  padding: 5px 10px;
  display: flex;
}

.form-item-title {
  font-size: 14px;
  margin-bottom: 5px;
  width: 100px;
  margin-right: 10px;
}

.form-item-content {
  font-size: 16px;
  line-height: 18px;
  width: calc(100% - 110px);
}

.company-introduction {
  font-size: 14px;
  text-indent: 20px;
}

.job-openings-all {
  font-size: 20px;
  text-align: center;
}

.job-openings-not {
  color: #777777;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}


.job-openings-title {
  font-size: 18px;
  margin-bottom: 5px;
}

.job-openings-pay {
  font-size: 20px;
  color: red;
  margin-bottom: 5px;
}

.job-openings_message {
  color: #555555;
  margin-bottom: 10px;
}

.job-openings-button {
  display: flex;
  justify-content: end;
  margin: 10px 0 5px;
}

.aaa {
  color: #999999;
  font-size: 12px;
}

.position-content {
  text-align: right;
  color: #409eff;
  line-height: 24px;
}

</style>
