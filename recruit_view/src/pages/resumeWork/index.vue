<template>
  <view class="curriculum">
    <view class="title-h5 card_title">工作经历</view>
    <view
      v-for="(formItem, index) in formDateList"
      :key="index"
      class="form-item"
      :class="{
        'form-item-select':  ['date', 'picker'].includes(formItem.type),
        'form-item-textarea':  formItem.type === 'textarea',
        'form-item-last':  index === formDateList.length - 1,

      }"
    >
      <view class="form-item-title">{{ formItem.title }}：</view>
      <view class="form-item-content">
        <picker
          :placeholder="'请选择' + formItem.title"
          v-if="formItem.type === 'region'"
          mode="multiSelector"
          range-key="value"
          :value="basicInfo[formItem.key]"
          @change="(e) => change(e, formItem.key, formItem.options)"
          @columnchange="bindcolumnchange"
          :range="provinceCity"
        >
          <view class="picker">
            {{ basicInfo[formItem.key]  || '请选择'}}
          </view>
        </picker>
        <picker
          :placeholder="'请选择' + formItem.title"
          v-else-if="formItem.type === 'picker'"
          @change="(e) => change(e, formItem.key, formItem.options)"
          range-key="value"
          :value="basicInfo[formItem.key]"
          :range="formItem.options">
          <view class="uni-input">
            <view v-if="basicInfo[formItem.key]">{{ getValue(formItem) }}</view>
            <view v-else style="color: #999999">请选择{{ formItem.title }}</view>
          </view>
        </picker>
        <view v-else-if="formItem.type === 'image'">
          <view
            class="form-item-image form-item-image-button"
            v-if="!basicInfo[formItem.key]"
            @click="uploads(formItem.key)"
          >
            上传图片
          </view>
          <image
            mode="heightFix"
            class="form-item-image"
            v-else
            :src="basicInfo[formItem.key]"/>
        </view>

        <input
          v-else-if="formItem.type === 'input'"
          v-model="basicInfo[formItem.key]"
          class="uni-input"
          :placeholder="'请输入' + formItem.title"
          maxlength="100"
        />
        <textarea
          v-else-if="formItem.type === 'textarea'"
          v-model="basicInfo[formItem.key]"
          class="uni-input"
          :placeholder="'请输入' + formItem.title"
          maxlength="1000"
        />

        <picker
          v-else-if="formItem.type === 'date'"
          mode="date"
          :placeholder="'请选择' + formItem.title"
          :value="basicInfo[formItem.key]"
          @change="e => bindDateChange(formItem.key, e)"
        >

          <view v-if="basicInfo[formItem.key]">{{ basicInfo[formItem.key] }}</view>
          <view v-else style="color: #999999">请选择{{ formItem.title }}</view>
        </picker>

      </view>
      <image
        v-if="['date', 'picker'].includes(formItem.type)"
        class="form-item-select-img"
        src="../../static/icon/right.png"
      />
    </view>

    <view
      class="button curriculum-submit"
      @click="submit"
    >
      提交
    </view>

    <view
      v-if="this.basicInfo.experienceID"
      class="button curriculum-submit delete-fun"
      @click="deleteFunShowModal"
    >
      删除
    </view>
  </view>
</template>

<script>
import {resumeWork} from "@/pages/index/formDateList";
import {API} from "@/utils/js/requectList";
import {genDate, requiredCheckFun} from "@/utils";
import {HTTPURL} from "@/utils/js/config";
import {isOnclicks, modelT, navBack} from "@/utils/js/utils";

export default {
  name: 'resumeWork',
  data() {
    return {
      provinceCity: [],
      formDateList: [],
      basicInfo: {
        "jobType": "", // 工作类型
        "companyName": "",// 企业名称
        "positionTitle": "",// 岗位
        "city": "",// 城市
        "startDate": "",//
        "endDate": "",//
        "jobDescription": "",// 工作内容
      }
    }
  },
  onLoad(option) {
    this.basicInfo.resumeID = option.resumeID;
    this.basicInfo.experienceID = option.id;
    if (!this.basicInfo.resumeID) {
      modelT('resumeID不能为空')
    }
    this.getResumeData(this.basicInfo.experienceID)
    this.initFormDateList()
  },
  methods: {
    bindcolumnchange(e) {
      const {column, value} = e.detail;
      if (column === 0) {
        this.provinceCity[1] = this.RegionEnum[value].childern.map(item => {
          return {
            key: item.adcode,
            value: item.title,
          }
        })
      }
    },


    async initFormDateList() {
      let {code, data, message} = await API.getEnumMap();
      this.RegionEnum = data.RegionEnum;
      this.provinceCity[0] = data.RegionEnum.map((item, index) => {
        return {
          key: item.adcode,
          value: item.title,
          index: index
        }
      })
      this.provinceCity[1] = this.RegionEnum[0].childern.map(item => {
        return {
          key: item.adcode,
          value: item.title,
        }
      })
      this.formDateList = resumeWork.map(item => {
        if (item.key === 'city') {
          item.options = data.RegionEnum.map(item => {
            return {
              key: item.adcode,
              value: item.title,
            }
          })
        }
        return item;
      })
    },

    bindDateChange(key, e) {
      this.basicInfo[key] = e.detail.value
    },

    uploads(key) {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: HTTPURL + '/jobApplication/uploads', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: (data) => {
              if (data.statusCode === 200) {
                const _data = JSON.parse(data.data);
                if (_data.code === 200) {
                  this.basicInfo[key] = HTTPURL + '/jobApplication/download?filename=' + _data.data.path;
                }
              }
            }
          });
        }
      });
    },

    change(e, key, options) {

      const index = e.detail.value;
      if (key === 'city') {
        console.log(index.length);
        if (index.length === 1) {

          this.basicInfo[key] = this.provinceCity[0][e.detail.value[0]].value
        } else {
          console.log('provinceCity',this.provinceCity[1][e.detail.value[1]].value);
          this.basicInfo[key] = this.provinceCity[1][e.detail.value[1]].value
        }
      } else {
        this.basicInfo[key] = options[index].key;
      }
    },

    getValue({options, key, title}) {
      const item = options.find(item => item.key === this.basicInfo[key]);
      return item ? item.value : '请选择' + title
    },

    async submit() {
      if (!isOnclicks()) {
        return
      }
      if (!requiredCheckFun(this.basicInfo, this.formDateList)) {
        return
      }
      await API[this.basicInfo.experienceID ? 'updateWorkExperience' : 'addWorkExperience'](this.basicInfo);
      modelT(`${this.basicInfo.experienceID ? '修改' : '新增'}成功`)
      const ID = setTimeout(() => {
        navBack('pages/resume/index');
        clearTimeout(ID)
      }, 600)
    },


    async getResumeData(experienceID) {
      if (!experienceID) {
        return
      }
      const {data} = await API.getWorkExperienceByExperienceID({
        experienceID: experienceID
      });
      this.basicInfo = {
        ...data,
        startDate: genDate(data.startDate),
        endDate: genDate(data.endDate),
      };
    },
    deleteFunShowModal() {
      if (!isOnclicks()) {
        return
      }
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        success: (res) => {
          if (res.confirm) {
            this.deleteFun();
          }
        }
      })
    },
    async deleteFun() {
      if (!isOnclicks()) {
        return
      }
      await API.removeWorkExperience({
        experienceID: this.basicInfo.experienceID
      });
      modelT(`删除成功`)
      const ID = setTimeout(() => {
        navBack('pages/resume/index');
        clearTimeout(ID)
      }, 600)
    }
  }
}
</script>

<style>
.curriculum {
  padding: 0 20px 20px;
}

.curriculum-submit {
  width: 200px;
  margin: 10px auto;
}

.delete-fun {
  background: red;
  margin-top: 20px;
}

.title-h5 {
  height: 20px;
  font-size: 18px;
  text-align: center;
  margin: 20px 0;
}


.form-item {
  padding: 10px 10px;
  display: flex;
  border-bottom: 1px solid #cccccc;
  align-items: center;
}

.form-item-last {
  border-bottom: none;
}

.form-item-image {
  height: 50px;
  max-width: 100%;
}

.form-item-image-button {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px dashed #8c939d;
  font-size: 10px;

}

.form-item-textarea {
  align-items: flex-start;
}

.form-item-textarea > .form-item-content > .uni-input {
  width: 100%;
  border: 1px solid #eeeeee;
  padding: 5px;
  box-sizing: border-box;
}

.form-item-select {
  position: relative;
}

.form-item-select-img {
  position: absolute;
  pointer-events: none;
  display: block;
  width: 20px;
  height: 20px;
  right: 0;
}


.form-item-title {
  font-size: 14px;
  margin-bottom: 5px;
  width: 100px;
  margin-right: 10px;
  color: #999999;
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
}

.job-openings-button {
  display: flex;
  justify-content: center;
  margin: 10px 0 5px;
}
</style>
