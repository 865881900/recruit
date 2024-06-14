<template>
  <div class="resume-info">
    <div>
<!--      <img-->
<!--        class="back"-->
<!--        src="../../../public/1718283687595.jpg"-->
<!--      />-->

      <div class="basic-info">
        <div>
          <div class="basic-info-name">
            {{ resumeFromData.name }}
            <span >{{resumeFromData.key}}</span>
          </div>
          <div class="basic-info-item">

            <div>手机:{{ resumeFromData.phoneNumber }}</div>
            <div>邮箱:{{ resumeFromData.email }}</div>
            <div>民族:{{ resumeFromData.ethnicity }}</div>

            <div>生日:{{ resumeFromData.birthday }}</div>
            <div>微信号:{{ resumeFromData.weChat }}</div>
            <div>性别:{{ resumeFromData.gender === '1' ? '男' : '女' }}</div>

            <div>政治面貌:{{ resumeFromData.politicalStatus }}</div>
            <div>最早入职时间:{{ resumeFromData.earliestStartDate }}</div>
            <div></div>
            <div>求职身份:{{ resumeFromData.jobSeekerStatus }}</div>
            <div>个人社交主页:{{ resumeFromData.socialProfile }}</div>
          </div>
        </div>
        <el-image
          @load="imgLoad"
          fit="contain"
          class="basic-info-img" :src="resumeFromData.avatar"
        />
      </div>
      <div class="title">教育经历</div>
      <div
        class="education-info"
        v-for="(item, index) in resumeFromData.educationHistoryList"
        :key="item.educationID"
      >
        <div class="education-info1">
          <div>{{ item.schoolName }}</div>
          <div>{{ item.degree }}</div>
          <div>{{ item.startDate }} - {{ item.endDate }}</div>
        </div>
        <div class="education-info2">
          <div>{{ item.major }}</div>
          <div>{{ item.city }}</div>
        </div>
        <div class="education-info3">{{ item.educationDescription }}</div>

      </div>

      <div class="title">工作经历</div>
      <div
        class="education-info"
        v-for="(item, index) in resumeFromData.workExperienceList"
        :key="item.experienceID"
      >
        <div class="education-info1">
          <div>{{ item.companyName }}</div>
          <div>{{ item.positionTitle }}</div>
          <div>{{ item.startDate }} - {{ item.endDate }}</div>
        </div>
        <div class="education-info2">
          <div>{{ item.jobType }}</div>
          <div>{{ item.city }}</div>
        </div>
        <div class="education-info3">{{ item.jobDescription }}</div>
      </div>

      <div class="title">个人说明</div>
      <div class="education-info3">{{ resumeFromData.personalStatement }}</div>
    </div>
  </div>
</template>

<script>
import GTable from '@/components/table/index.vue'
import moment from "moment";
import {getLabelByEquals} from "@/utils";
import {EducationRequirementEnum, JobSeekerStatusEnum, PoliticalStatusEnum} from "@/utils/emun";

export default {
  name: 'resumeInfo',
  components: {
    GTable
  },
  data(that) {
    return {
      // 简历信息
      resumeFromData: {
        "id": 3,
        "resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79",

        name: '王超朋',
        avatar: '',

        phoneNumber: '13720777831',
        email: '865881900@qq.com',
        weChat: '865881900@qq.com',


        gender: '男',
        birthday: '1992-02-02',
        iDNumber: '610528100202028975',


        ethnicity: '民族',
        politicalStatus: '政治面貌',
        jobSeekerStatus: '求职身份',


        earliestStartDate: '2020-12-12',
        socialProfile: 'www.wangchaopeng.com',

        personalStatement: '个人说明',

        "createDate": "2024-06-04T12:53:12.000Z",
        "updateDate": "2024-06-09T07:31:01.000Z",
        "workExperienceList": [
          {
            "id": 9,
            "experienceID": "EXPERIENCEID51feaa10x262ex11efxaa4bx8d95e57dbb73",
            "jobType": "工作类型",
            "companyName": "企业名称",
            "positionTitle": "岗位",
            "city": "城市",
            "startDate": "2022.12",
            "endDate": "2022.12",
            "jobDescription": "工作内容",
            "resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79"
          }
        ],
        "educationHistoryList": [
          {
            "id": 8,
            "educationID": "EDUCATIONID9464fd70x2271x11efx9aa9xdf71c8a27c79",
            "schoolName": "北京科技大学",
            "major": "信息化处理",
            "degree": "本科",
            "city": "北京",
            "startDate": "2022.12",
            "endDate": "2022.12",
            "educationDescription": "教育描述教育描述教育描述教育描述教育描述教育描述教育描述教育描述教育描述教育描述教",
            "resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79"
          },
          {
            "id": 9,
            "educationID": "EDUCATIONID9ab8dcf0x2271x11efx9aa9xdf71c8a27c79",
            "schoolName": "学校名称",
            "major": "专业",
            "degree": "学历",
            "city": "城市",
            "startDate": "2022.12",
            "endDate": "2022.12",
            "educationDescription": "教育描述",
            "resumeID": "RESUMEID670f27b0x2271x11efx9aa9xdf71c8a27c79"
          }
        ]
      },
      loadData: {
        imgLoad: false,
        iapLoad: false
      }
    }
  },
  computed: {
    applicationID() {
      return this.$route.query.applicationID
    },
    time() {
      return this.$route.query.time
    },
  },
  watch: {
    loadData: {
      deep: true,
      handler(loadData) {
        if(loadData.imgLoad === true && loadData.iapLoad === true) {
          console.log('触发');
          window['n' + this.time] = true;
        }
      }
    }
  },
  created() {
    this.getResume()
  },
  mounted() {
    document.body.style.width = document.documentElement.style.width = '1080px';

  },
  methods: {
    imgLoad() {
      this.loadData.imgLoad = true;
    },

    // 获取简历信
    async getResume() {
      try {
        const {data, code, message} = await this.$http.get('/jobApplication/getApplication', {
          params: {
            applicationID: this.applicationID
          }
        })
        if (code === 200) {
          this.resumeFromData = {
            ...data,
            politicalStatus: getLabelByEquals(PoliticalStatusEnum, item => item.key === data.politicalStatus) || '',
            jobSeekerStatus: getLabelByEquals(JobSeekerStatusEnum, item => item.key === data.jobSeekerStatus) || '',
            avatar: process.env.VUE_APP_BASE_API + data.avatar,
            earliestStartDate: moment(data.earliestStartDate).format('yyyy-MM-DD'),
            birthday: moment(data.birthday).format('yyyy-MM-DD'),
            workExperienceList: data.workExperienceList.map(item => {
              return {
                ...item,
                startDate: moment(item.startDate).format('yyyy.MM'),
                endDate: moment(item.endDate).format('yyyy.MM'),
              }
            }),
            educationHistoryList: data.educationHistoryList.map(_item => {
              return {
                ..._item,
                degree: getLabelByEquals(EducationRequirementEnum, item => item.key === _item.degree) || '',
                startDate: moment(_item.startDate).format('yyyy.MM'),
                endDate: moment(_item.endDate).format('yyyy.MM'),
              }
            })
          }
          this.$nextTick(() => {
            this.loadData.iapLoad = true;
          })
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
.title {
  background: rgba(64, 158, 255, 0.53);
  height: 40px;
  font-size: 25px;
  line-height: 40px;
  padding: 0 20px;
  font-weight: bold;
  margin: 20px 0;
}

.education-info {
  font-size: 20px;
  padding: 10px 20px;
  font-weight: 500;
}


.education-info1, .education-info2 {
  display: flex;
}

.education-info1 > div:nth-child(1) {
  width: 50%;
}

.education-info1 > div:nth-child(2) {
  width: 30%;
}

.education-info1 > div:nth-child(3) {
  width: 20%;
}

.education-info2 > div {
  width: 50%;
}

.education-info3 {
  font-size: 18px;
  font-weight: 400;
}

.resume-info {
  width: 1080px;
}

.resume-info > div {
  height: 1528px;
  position: relative;
  padding: 55px 90px;
  overflow: hidden;
}

.basic-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.basic-info-img {
  width: 150px !important;
}

.basic-info > div {
  width: calc(100% - 200px);
}

.basic-info-name {
  font-size: 40px;
  font-weight: 500;
  line-height: 50px;
}

.basic-info-name > span {
  color: #409EFF;
  font-size: 20px;
}

.basic-info-item {
  font-size: 22px;
  line-height: 30px;
}

.basic-info-item > div {
  display: inline-block;
  font-weight: bold;
  word-break: break-all;
  vertical-align: top;
  margin-bottom: 10px;
}

.basic-info-item > div:nth-child(3n + 1) {
  width: 35%;
}

.basic-info-item > div:nth-child(3n+2) {
  width: 45%;
}

.basic-info-item > div:nth-child(3n+ 3) {
  width: 20%;
}


.back {
  top: 0;
  left: 0;
  position: absolute;
  width: 1080px;
  height: 1528px;
  z-index: -1;
  opacity: 0.6;
}

</style>
