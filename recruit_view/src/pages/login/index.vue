<template>
  <view class="login">


    <img src="../../static/logo.png" class="login-logo"/>
    <view class="login-from">
      <view class="login-from-input">
        <span class="login-from-input-label">账号：</span>
        <input
          class="login-from-input-input"
          v-model="userinfo.username"
          :maxlength="20"
          placeholder="请输入账号"
        />
      </view>
      <view class="login-from-input">
        <span class="login-from-input-label">密码：</span>
        <input
          type="password"
          :maxlength="20"
          class="login-from-input-input"
          v-model="userinfo.password"
          placeholder="请输入密码"
        />
      </view>
    </view>

    <view
      class="button login-from-button"
      @click="login"
    >
      登录
    </view>

    <view
      class="register-from-button"
      @click="register"
    >
      注册
    </view>

  </view>
</template>

<script>
import {API} from "@/utils/js/requectList";
import {encryptJSEncrypt} from "@/utils/jSEncrypt";
import {requiredCheckFun} from "@/utils";
import {isOnclicks} from "@/utils/js/utils";

export default {
  name: "login",
  data() {
    return {
      userinfo: {
        username: 'admin',
        password: '111111',
      }
    }
  },
  methods: {
    register() {
      uni.navigateTo({
        url: '/pages/register/index'
      })
    },

    async login() {
      if (!isOnclicks()) {
        return
      }
      const requiredCheck = [
        {
          key: 'username',
          title: '账号',
          type: 'input',
          validator(v) {
            if (v.length < 6) {
              return '账号长度不能小于6位'
            }
          }
        },
        {
          key: 'password',
          title: '密码',
          type: 'input',
          validator(v) {
            if (v.length < 6) {
              return '密码长度不能小于6位'
            }
          }
        }
      ];
      if (!requiredCheckFun(this.userinfo, requiredCheck)) {
        return
      }
      const {password, username} = this.userinfo;
      let {code} = await API.login({
        userName: username,
        password: encryptJSEncrypt(password),
      });
      if (code === 200) {
        await this.getUserInfo();
      }
    },

    async getUserInfo() {
      let {code, data} = await API.getUserinfo();
      if (code === 200) {
        uni.setStorageSync('userinfo', JSON.stringify(data));
        const initialPath = uni.getStorageSync('initialPath');
        const currentPath = uni.getStorageSync('currentPath');
        let path = currentPath || initialPath;
        if (['pages/login/index', 'pages/register/index'].find(item => path.startsWith(item))) {
          const companyID = uni.getStorageSync('companyID');
          path = `pages/index/index?companyID=${companyID}`
        }
        if (['pages/index/index', 'pages/my/index'].find(item => path.startsWith(item))) {
          uni.reLaunch({
            url: `/${path}`,
          })
        } else {
          uni.redirectTo({
            url: `/${path}`,
          })
        }
      }
    },
  }
}
</script>

<style scoped>
.login-logo {
  width: 100px;
  height: 100px;
  margin: 20px auto 40px;
  display: block;
}


.login-from {
  width: calc(100% - 40px);
  padding: 0 20px;
}

.login-from-input {
  background-color: rgba(153, 153, 153, 0.13);
  padding: 10px 20px;
  height: 40px;
  border-radius: 40px;
  box-sizing: border-box;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.login-from-input-label {
  width: 70px;
  text-align: right;
  color: #999999;
}

.login-from-input-input {
  width: calc(100% - 70px);
}

.login-from-button {
  margin-top: 100px;
  width: 200px;
}

.register-from-button {
  text-align: center;
  color: #409eff;
  margin-top: 20px;

}

</style>
