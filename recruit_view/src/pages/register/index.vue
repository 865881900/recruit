<template>
  <view class="login">


    <img src="../../static/logo.png" class="login-logo"/>
    <view class="login-from">
      <view class="login-from-input">
        <span class="login-from-input-label">账号：</span>
        <input
          :maxlength="20"
          class="login-from-input-input"
          v-model="userinfo.username"
          placeholder="请输入账号"
        />
      </view>
      <view class="login-from-input">
        <span class="login-from-input-label">密码：</span>
        <input
          :maxlength="20"
          type="password"
          class="login-from-input-input"
          v-model="userinfo.password"
          placeholder="请输入密码"
        />
      </view>
      <view class="login-from-input">
        <span class="login-from-input-label">确认密码：</span>
        <input
          :maxlength="20"
          type="password"
          class="login-from-input-input"
          v-model="userinfo.password1"
          placeholder="请再次输入密码"
        />
      </view>
    </view>

    <view
      class="button login-from-button"
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
import {isOnclicks, modelT} from "@/utils/js/utils";

export default {
  name: "register",
  data() {
    return {
      userinfo: {
        username: '',
        password: '',
        password1: '',
      }
    }
  },
  methods: {

    async register() {
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
        },
        {
          key: 'password1',
          title: '确认密码',
          type: 'input',
          validator(v) {
            if (v.length < 6) {
              return '再次输入的密码长度不能小于6位'
            }
          }
        }
      ];
      const {username, password, password1} = this.userinfo;
      if (password !== password1) {
        modelT('两次输入的密码不一致');
        return
      }
      if (!requiredCheckFun(this.userinfo, requiredCheck)) {
        return
      }
      await API.signIn({
        userName: username,
        password: password,
      });
      modelT('注册成功');
      const ID = setTimeout(() => {
        uni.reLaunch({
          url: `/pages/login/index`,
        })
        clearTimeout(ID);
      }, 1000)
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
