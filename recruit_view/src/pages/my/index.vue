<template>
  <view class="my">
    <view class="userinfo">
      <img src="../../static/userimg.png"/>
      <view style="flex:1;">
        {{ userinfo.username }}
      </view>
      <view
        class="userinfo-button button"
        @click="logOut(!!userinfo.userInfoID)"
      >
        {{ userinfo.userInfoID ? '退出登录' : '去登录' }}
      </view>
    </view>

    <view
      class="my-list"
      @click="toResume"
    >
      <img src="../../static/icon/jl.png" class="my-list-right"/>
      <span>个人简历</span>
      <img src="../../static/icon/right.png" class="my-list-left"/>
    </view>
  </view>
</template>

<script>
import {API} from "@/utils/js/requectList";
import {isOnclicks} from "@/utils/js/utils";

export default {
  name: "my",
  data() {
    return {
      userinfo: {
        username: '用户名',
        userInfoID: '',
      }
    }
  },
  onLoad() {
    const userinfo = uni.getStorageSync('userinfo');
    if (userinfo) {
      this.userinfo = JSON.parse(userinfo)
    }
  },

  methods: {
    async logOut(isLogin) {
      if (!isOnclicks()) {
        return
      }
      if (isLogin) {
        let {code, data, message} = await API.logOut();
        if (code === 200) {
          uni.removeStorageSync('userinfo');
          uni.navigateTo({
            url: `/pages/login/index`,
          })
        }
      } else {
        uni.navigateTo({
          url: `/pages/login/index`,
        })
      }
    },

    toResume() {
      if (!isOnclicks()) {
        return
      }
      if (!this.userinfo.userInfoID) {
        uni.navigateTo({
          url: `/pages/login/index`,
        })
        return
      }
      // 新建简历
      uni.navigateTo({
        url: `/pages/resume/index`,
      })
    }
  }
}
</script>

<style scoped>
.my {
  padding: 20px;
}

.userinfo {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.userinfo > img {
  height: 70px;
  width: 70px;
  margin-right: 20px;
}

.userinfo-button {
  font-size: 10px;
  height: 30px;
  line-height: 30px;
  width: 80px;
}

.my-list {
  height: 40px;
  border-bottom: 1px solid #999999;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: c;
}
.my-list > span {
  flex: 1;
}
.my-list > img {
  height: 20px;
  width: 20px;
}
</style>
