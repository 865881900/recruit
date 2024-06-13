import {HTTPURL, OSSHTTPURLUPLOAD, OSSHTTPURL} from "./config.js";
// import {GetSign} from "@/static/js/sign";
//封装的请求
export const request = function (url, method = 'POST', data = undefined) {
  if (method == 'GET' && data) {
    url += '?';
    let urlRight = ''
    for (let dataKey in data) {
      urlRight += `&${dataKey}=${data[dataKey]}`
    }
    url += urlRight.substr(1)
  }
  const promise = new Promise((resolve, reject) => {
    uni.request({
      url: HTTPURL + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'max-age=60',
      },
      success: async (res) => {
        if (res.data.code === 401) {
          modelT('登录过期');
          // 清除缓存
          uni.removeStorageSync('userinfo');
          // 记录路由
          const _data = await getCurrentPageUrl();
          uni.setStorageSync('currentPath', _data.url);
          uni.navigateTo({
            url: `/pages/login/index`,
          })
        } else if (res.data.code === 500) {
          modelT(res.data.message)
        } else {
          resolve(res.data)
        }
      },
      fail() {
        modelT('网络异常')
      }
    })
  });
  return promise;
};

//提示消息函数
export const modelT = function (msg, duration = 2000, fun = () => {
}) {
  if (!msg) {
    msg = "数据请求失败，请稍后再试。"
  }
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: duration,
    success: () => {
      let id = setTimeout(() => {
        (typeof fun == "function") && fun()
        clearTimeout(id);
      }, duration)
    }
  })
};


//限制点击
export const isOnclick = function (time = 600) {
  let isOnclick = true;
  let delayed = function () {
    isOnclick = false
    setTimeout(function () {
      isOnclick = true;
    }, time)
  }
  return function () {
    if (isOnclick) {
      delayed();
      return true;
    }
    return false;
  }
}

export const isOnclicks = isOnclick();


export function navBack(page, fun) {
  let delta = 0;
  let index = -1;
  if (page) {
    let pages = getCurrentPages(); //获取加载的页面
    for (let i = 0; i < pages.length; i++) {
      if (page.startsWith(pages[i].route)) {
        index = i;
        continue
      }
    }
    if (index == -1) {
      uni.navigateTo({
        url: `/${page}`
      })
      return
    }
    delta = pages.length - (index + 1);
  }
  if (delta == 0) {
    console.error('已经是最后了');
    return
  }
  uni.navigateBack({
    delta,
    complete: () => {
      typeof fun == 'function' && fun()
    }
  })
}

//路由优化
export const Router = {
  navTo: function () {
    return (function () {
      let state = 1,
        a,
        isOnclicks = isOnclick();
      return ({url, success}) => {
        let data = getCurrentPageUrl(),
          presentUrl = new RegExp(`^/${data.url}`);
        if (a = !isOnclicks() || state == 0) {
          return
        } else if (presentUrl.test(url)) {
          return
        } else if (!url) {
          return
        }
        state = 0
        uni.navigateTo({
          url,
          success: (res) => {
            if (typeof success == 'function') {
              success(res)
            }
          },
          fail: (error) => {
            console.log(error)
          },
          complete: () => {
            state = 1;
          }
        })
      }

    }())
  }(),
  /**
   * 如果有page 执行 回退到具体页面操作,如果没有该页面,则没有效果,控制台打印错误
   * @param delta 回退第几页
   * @param page 要回退到的页面
   * @param fun 回退成功后回调
   */
  navBack({delta, page}, fun) {
    let index = -1;
    if (page) {
      let pages = getCurrentPages(); //获取加载的页面
      for (let i = 0; i < pages.length; i++) {
        if (`/${pages[i].route}` === page) {
          index = i;
          continue
        }
      }
      if (index == -1) {
        console.error('页面栈里面没有改页面');
        return
      }
      delta = pages.length - (index + 1);
    }
    if (delta == 0) {
      console.error('已经是最后了');
      return
    }
    uni.navigateBack({
      delta,
      complete: () => {
        typeof fun == 'function' && fun()
      }
    })
  },

  reLaunch({
             url, fun = () => {
    }
           }) {
    console.log('跳转到首页')
    wx.reLaunch({
      url,
      success(res) {
        console.log('跳转成功')
        fun()
      }
    })
  }
};


/*获取当前页url*/
async function getCurrentPageUrl() {
  let pageList = getCurrentPages();
  const pageIndex = pageList.lastIndexOf(item => !['pages/register/index', 'pages/login/index'].includes(item.route))
  if (pageIndex == -1) {
    return {
      url: '',
      length: pageList.length
    }
  }
  const {route, options} = pageList[pageIndex];


  let query = [];
  for (let queryKey in options.query) {
    query.push(`${queryKey}=${options.query[queryKey]}`)
  }
  return {
    url: `${route}${query.length > 0 ? ('?' + query.join('&')) : ''}`,
    length: pageList.length
  }
}

//返回当前滑动的方向
//0为下,1为上
export const getScrollDirection = (top = true) => {
  let l, t;
  return function (n, o) {
    if (!l) {
      t = top ? 0 : 1;
      l = n
    } else {
      t = (n > l) ? 0 : 1;
      l = n
    }
    return t
  }
}


//单位转换
export const unitConversion = {
  storage(number) {
    if (number < 1024) {
      return `${number}KB`
    } else if (number < 1024 * 1024) {
      return `${(number / 1024).toFixed(2)}MB`
    } else {
      return `${(number / 1024 / 1024).toFixed(2)}BG`
    }
  }
}

//封装支付
export async function pay(paydata, fun = () => {
}) {

  wx.requestPayment({
    timeStamp: paydata.timeStamp,
    nonceStr: paydata.nonceStr,
    package: 'prepay_id=' + paydata.prepayID,
    signType: paydata.signType,
    paySign: paydata.paySign,
    success(res) {
      fun()
    },
    fail() {
      modelT('支付失败')
    },
    complete() {
      uni.hideLoading()
    }
  })
}

//oss 直传
export const uploadOssImage = async function (type, uid, that, albumid) {

  try {
    let regexp = /^Message[\w]*/,
      types = type.split("_")[1],
      count = types == 'image' ? 9 : 1,
      uploadTask,

      getMethodByType = (type) => {
        if (regexp.test(type)) {
          return new Promise(((resolve, reject) => {
            wx.chooseMessageFile({
              count: count,
              type: types,
              success(res) {
                resolve(res)
              },
              fail(error) {
                reject(error)
              }
            })
          }))

        } else {
          return new Promise(((resolve, reject) => {
            uni.chooseMedia({
              count,
              mediaType: [types],
              sourceType: ['album'],
              maxDuration: 30,
              camera: 'back',
              success(res) {
                resolve(res)
              },
              fail(error) {
                reject(error)
              }
            });
          }))

        }
      },
      getUploadPolicy = () => {
        return request(`/LZPhotoV2/S1_GetUploadPolicy`, 'get', {
          sign: 'aaa',
          uid
        })
      },
      uploadOssList = (tempFiles, data) => {
        let uploadOssLists = [],
          fileType,
          filePath,
          lastIndex;
        tempFiles.map(item => {

          uploadOssLists.push(() => {
            return new Promise((resolve, reject) => {
              filePath = item.path || item.tempFilePath;
              console.log(filePath, 'filePath')
              lastIndex = filePath.lastIndexOf('.');
              fileType = filePath.substr(lastIndex, filePath.length)
              let key = data.dir + new Date().getTime() + fileType;
              console.log(key, 'key')
              uploadTask = uni.uploadFile({
                url: OSSHTTPURL,
                filePath,
                name: 'file', // 必须填file。
                formData: {
                  name: item.path,        //文件
                  key,               //存储路径及名称
                  policy: data.policy,
                  OSSAccessKeyId: data.accessid,
                  signature: data.signature,
                  success_action_status: '200'
                },
                success(res) {
                  resolve(Object.assign({
                    res,
                    path: OSSHTTPURLUPLOAD + key,
                    item
                  }))
                },
                fail(e) {
                  reject(e)
                }
              });

              types == 'video' && uploadTask.onProgressUpdate((res) => {
                that.percent = res.progress
              })
            })
          })
        });

        return uploadOssLists
      },
      submitUserImage = (imageurl, imagesize) => {
        return request(`/LZPhotoV2/A5_SubmitUserImage?sign=${'aaa'}`, 'POST', {
          uid,
          albumid,
          imageurl,
          imagesize
        })
      },
      submitUserVideo = (videourl, videosize, videoduration) => {
        return request(`/LZPhotoV2/A6_SubmitUserVideo?sign=${'aaa'}`, 'POST', {
          uid,
          albumid,
          videourl,
          videoduration,
          videosize

        })
      },
      upLiadServer = (fileDetailList) => {
        let upLiadServerList = [],
          method = (types == 'image') ? 'submitUserImage' : 'submitUserVideo'
        if (types == 'image') {
          fileDetailList.map(({path, item: {size}}) => {
            upLiadServerList.push(() => {
              return submitUserImage(path, size)
            })
          })
        } else if (types == 'video') {
          fileDetailList.map(({path, item: {size, duration}}) => {
            upLiadServerList.push(() => {
              return submitUserVideo(path, size, duration)
            })
          })
        }
        return upLiadServerList
      };
    let [{tempFiles, errMsg}, {data: {data, code}}] = await Promise.all([getMethodByType(type), getUploadPolicy()]);
    if (errMsg != 'chooseMedia:ok' && errMsg != 'chooseMessageFile:ok') {
      throw `获取本地文件失败,${type}`
    } else if (code != 200) {
      throw `获取oss上传秘钥失败`
    }
    let fileDetailList = await Promise.all(uploadOssList(tempFiles, data).map(item => {
      return item()
    }))
    return await Promise.all(upLiadServer(fileDetailList).map(item => {
      return item()
    }))

  } catch (e) {
    console.error(e)
  }


}
