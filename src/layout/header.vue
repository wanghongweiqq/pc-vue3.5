<template>
  <div class="ly-header">
    <div class="part-left">
      <p>{{ infor.sellerName }}，欢迎您使用云配商家后台系统!</p>
    </div>
    <div class="part-right">
      <dl class="login-infor">
        <dt>
          <el-icon class="icon-user">
            <UserFilled />
          </el-icon>
          <span>{{ infor.sellerId }}</span>
          <el-icon class="icon-caret">
            <CaretBottom />
          </el-icon>
        </dt>
        <dd>
          <ul>
            <li @click="logoutHandler">
              <el-icon class="icon-right">
                <Right />
              </el-icon> 退出
            </li>
          </ul>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LyHeader',
  data () {
    return {
      infor: window.BSGlobal && window.BSGlobal.getUserInfo ? window.BSGlobal.getUserInfo : {},
      isLogin: false
    }
  },
  methods: {
    logoutHandler () {
      // 原实现使用 this.$jsonp（未注册会崩溃），改用 fetch + CORS
      fetch('https://zs.360cec.com/idp/logout', { credentials: 'include' })
        .then(() => {
          window.location.href = '/xxx/logout'
        })
        .catch(err => {
          console.error(err)
          // fetch 报错（如 CORS 未配置）时仍执行本地登出，避免卡死
          window.location.href = '/xxx/logout'
        })
    }
  }
}
</script>
<style lang="scss">
.ly-header {
  height: 50px;
  background: #ffffff;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.3);
  display: flex;
  padding: 0 20px 0 60px;
  flex-shrink: 0;
  justify-content:space-between;
  align-items: center;
  color: #8098b0;
  .part-left{
    padding-left:12px;
    line-height: 30px;
    border-left:1px solid #eaedf4;
    font-size:12px;
  }
  .part-right{
    display: flex;
    align-items: center;
    height: 100%;
    .login-infor{
      position: relative;
      display: flex;
      height:100%;
      align-items: center;
      font-size:13px;
      &:hover{
        dt{
          background: #f2f3f5;
          .icon-caret{
            transform: rotate(-180deg);
          }
        }
        dd{
          top:100%;
          visibility: visible;
        }
      }
      dt {
        display: flex;
        align-items: center;
        height:100%;
        min-width: 100px;
        max-width: 200px;
        padding:0 12px;
        box-sizing: border-box;
        border-left:1px solid #eaedf4;
        cursor: pointer;
        .icon-user{
          border:1px solid #8098b0;
          padding:1px;
          border-radius: 50%;
          margin-right: 5px;
        }
        .icon-caret{
          transition: all 0.4s ease-in-out 0s;
          margin-left: 5px;
        }
        span{
          flex-grow: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      dd{
        z-index: 5;
        position: absolute;
        left:0;
        top:70%;
        width:100%;
        background: #ffffff;
        border:1px solid #eaedf4;
        transition: all 0.4s ease-in-out 0s;
        visibility: hidden;
        ul{
          max-height: 270px;
          overflow-x: hidden;
          overflow-y: auto;
          li{
            display: flex;
            align-items: center;
            padding-left:12px;
            line-height: 40px;
            color: #8098b0;
            &:hover{
              color: #ffffff;
              background-color: #02aadb;
            }
            .icon-right{
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}

</style>
