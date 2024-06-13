<script>
import {API} from "@/utils/js/requectList";

export default {
  data() {

  },
  onLoad(option) {

  },
  onLaunch: function (option) {
    // 缓存企业ID
    if (option.query && option.query.companyID) {
      uni.setStorageSync('companyID', option.query.companyID);
    }
    // 缓存第一次进入时的页面
    if (option.path) {
      let query = [];
      for (let queryKey in option.query) {
        query.push(`${queryKey}=${option.query[queryKey]}`)
      }
      const path = `${option.path}${query.length > 0 ? ('?' + query.join('&')) : ''}`
      uni.setStorageSync('initialPath', path);
      this.path = path;
    }
    this.getUserInfo();
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    async getUserInfo() {
      let {code, data} = await API.getUserinfo();
      if (code === 200) {
        // 登录状态
        uni.setStorageSync('userinfo', JSON.stringify(data));
      }
    },
  }
}
</script>

<style>
.page {
  padding: 10px 0;
  color: #333;
  background-color: #f8f8f8;
  min-height: 100%;
}


.card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: .3s;
  padding: 5px 10px;
}

.card_title {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
  font-size: 18px;
}

.card_title::after {
  content: "";
  position: absolute;
  display: block;
  height: 2px;
  border-radius: 1px;
  width: 100%;
  background-color: #409eff;
}

.mini-btn {
  margin: auto;
}

.button {
  width: 100px;
  height: 40px;
  line-height: 40px;
  background-color: #409eff;
  color: #FFFFFF;
  font-size: 14px;
  text-align: center;
  display: block;
  margin: auto;
  border-radius: 20px;
}

</style>
