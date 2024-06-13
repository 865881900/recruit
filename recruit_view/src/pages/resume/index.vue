<template>
  <view class="resume">
    <view>
      <h5 class="card_title">
        个人信息
        <img src="../../static/icon/bj.png" @click="toPath('pages/resumeBasics/index', basicInfo.resumeID)"/>
      </h5>
      <view class="education-name">{{ basicInfo.name }}</view>
      <view class="basicInfo-item">
        <img src="../../static/icon/sj.png"/>
        {{ basicInfo.phoneNumber }}
      </view>
      <view class="basicInfo-item">
        <img src="../../static/icon/wx.png"/>
        {{ basicInfo.weChat }}
      </view>
      <view class="basicInfo-item">
        <img src="../../static/icon/yx.png"/>
        {{ basicInfo.email }}
      </view>
      <view class="basicInfo-list">
        <view
          v-for="(item, index) in basicInfoList"
          :key="index"
        >
          <span class="basicInfo-list-label">{{ item.label }}：</span>
          <span>{{ basicInfo[item.key] }}</span>
        </view>
      </view>
    </view>
    <view>
      <h5 class="card_title">教育经历 <img src="../../static/icon/bj.png" height="128" width="128"/></h5>
      <view
        class="education card_index card"
        v-for="item in  educationHistoryList"
      >
        <view class="education-name">
          {{ item.schoolName }}
          <view class="education-data">
            <span>{{ genDate(item.startDate) }}</span>至<span>{{ genDate(item.endDate) }}</span>
          </view>
        </view>

        <view class="education-type">
          专业：{{ item.major }}
        </view>

        <view class="education-type">
          学历： {{ item.degree }}
        </view>
        <view class="education-type">
          城市：{{ item.city }}
        </view>
        <view class="education-type">
          教育描述：{{ item.educationDescription }}
        </view>
        <view
          class="education-edit"
          @click="toPath('pages/resumeEducation/index', basicInfo.resumeID, item.educationID)"
        >
          编辑
          <img src="../../static/icon/bj.png"/>
        </view>

      </view>
      <view
        class="button education-button"
        @click="toPath('pages/resumeEducation/index', basicInfo.resumeID)"
      >
        新增教育经历
      </view>
    </view>
    <view>
      <h5 class="card_title">工作经历 <img src="../../static/icon/bj.png" height="128" width="128"/></h5>

      <view
        class="education card_index card"
        v-for="item in  workExperienceList"
      >
        <view class="education-name">
          {{ item.companyName }}
          <view class="education-data">
            <span>{{ genDate(item.startDate) }}</span>至<span>{{ genDate(item.endDate) }}</span>
          </view>
        </view>
        <view class="education-type">
          城市：{{ item.city }}
        </view>
        <view class="education-type">
          工作类型：{{ item.positionTitle }}
        </view>
        <view class="education-type">
          岗位：{{ item.jobType }}
        </view>
        <view class="education-type">
          工作内容：{{ item.jobDescription }}
        </view>

        <view
          class="education-edit"
          @click="toPath('pages/resumeWork/index', basicInfo.resumeID, item.experienceID)"
        >
          编辑
          <img src="../../static/icon/bj.png"/>
        </view>

      </view>
      <view
        class="button education-button"
        @click="toPath('pages/resumeWork/index', basicInfo.resumeID)"
      >
        新增工作经历
      </view>
    </view>
  </view>
</template>

<script>
import {API} from "@/utils/js/requectList";
import {genDate, getLabelByEquals} from "@/utils";
import formDateList from "@/pages/index/formDateList";
import {isOnclicks} from "@/utils/js/utils";

export default {
  name: "resume",
  data() {
    return {
      basicInfo: {},
      basicInfoList: [
        {
          key: 'gender',
          label: '性别'
        },
        {
          key: 'birthday',
          label: '生日'
        },
        {
          key: 'ethnicity',
          label: '民族'
        },
        {
          key: 'politicalStatus',
          label: '政治面貌'
        },
        {
          key: 'earliestStartDate',
          label: '最早可入职日期'
        },
      ],
      educationHistoryList: [],
      workExperienceList: [],
      enumMap: {}
    }
  },
  async onLoad() {
    await this.getEnumMap();
    const userinfo = uni.getStorageSync('userinfo');
    if (userinfo) {
      this.userinfo = JSON.parse(userinfo)
      if (this.userinfo.resumeID) {
        await this.getResumeData(this.userinfo.resumeID)
      }
    }
  },
  onShow() {
    if (this.userinfo && this.userinfo.resumeID) {
      this.getResumeData(this.userinfo.resumeID)
    }
  },

  methods: {
    async getEnumMap() {
      let {code, data, message} = await API.getEnumMap();
      this.enumMap = data;
    },

    // 去编辑个人信息
    toPath(path, resumeID, id) {
      if (!isOnclicks()) {
        return
      }
      uni.navigateTo({
        url: `/${path}?resumeID=${resumeID}${id ? `&id=${id}` : ''}`,
      })
    },

    genDate(date) {
      return genDate(date)
    },

    async getResumeData(resumeID) {
      let {data} = await API.getResumeByResumeID({
        resumeID
      });
      this.educationHistoryList = data.educationHistoryList.map(_data => {
        return {
          ..._data,
          degree: getLabelByEquals(this.enumMap.EducationRequirementEnum, item => item.key === _data.degree) || '',
          city: getLabelByEquals(this.enumMap.RegionEnum, item => item.adcode === _data.city) || ''
        }
      });
      this.workExperienceList = data.workExperienceList.map(_data => {
        return {
          ..._data,
          city: getLabelByEquals(this.enumMap.RegionEnum, item => item.adcode === _data.city) || ''
        }
      });
      this.basicInfo = {
        ...data,
        gender: data.gender === '1' ? '男' : '女',
        earliestStartDate: genDate(data.earliestStartDate),
        birthday: genDate(data.birthday),
        politicalStatus: getLabelByEquals(this.enumMap.PoliticalStatusEnum, item => item.key === data.politicalStatus) || ''
      };
    },
  }
}
</script>

<style scoped>
.education-data {
  font-size: 10px;
  margin-top: 5px;
  color: #999999;
}

.education-button {
  width: 200px;
}

.education {
  position: relative;
  margin: 10px 0 20px;
}

.education-edit {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #409eff;
}

.education-edit > img {
  height: 20px;
  width: 20px;
}


.education-name {
  font-size: 16px;
}

.education-type {
  margin-top: 5px;
  font-size: 12px;
}

.education-type > span:last-child:after {
  content: "";
}

.education-type > span:after {
  content: "|";
  margin: 0 5px;
}

.resume {
  padding: 20px;
}

.card_title {
  margin-bottom: 10px;
}

.card_title > img {
  height: 25px;
  width: 25px;
  position: absolute;
}

.basicInfo-item {
  margin-top: 5px;
  font-size: 10px;
  height: 20px;
  display: flex;
  align-items: center;
}

.basicInfo-item > img {
  height: 20px;
  width: 20px;
  margin-right: 5px;
}

.basicInfo-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 20px;
}

.basicInfo-list > view {
  display: inline-block;
  padding: 0 5px;
  background-color: #999999;
  color: #FFFFFF;
  line-height: 20px;
  height: 20px;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
