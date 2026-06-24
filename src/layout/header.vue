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
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content:space-between;
  height: 50px;
  padding: 0 20px 0 60px;
  color: #8098b0;
  background: #fff;
  box-shadow: 0 0 5px rgb(0 0 0 / 30%);

  .part-left{
    padding-left:12px;
    font-size:12px;
    line-height: 30px;
    border-left:1px solid #eaedf4;
  }

  .part-right{
    display: flex;
    align-items: center;
    height: 100%;

    .login-infor{
      position: relative;
      display: flex;
      align-items: center;
      height:100%;
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
        box-sizing: border-box;
        display: flex;
        align-items: center;
        min-width: 100px;
        max-width: 200px;
        height:100%;
        padding:0 12px;
        cursor: pointer;
        border-left:1px solid #eaedf4;

        .icon-user{
          padding:1px;
          margin-right: 5px;
          border:1px solid #8098b0;
          border-radius: 50%;
        }

        .icon-caret{
          margin-left: 5px;
          transition: all 0.4s ease-in-out 0s;
        }

        span{
          flex-grow: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      dd{
        position: absolute;
        top:70%;
        left:0;
        z-index: 5;
        visibility: hidden;
        width:100%;
        background: #fff;
        border:1px solid #eaedf4;
        transition: all 0.4s ease-in-out 0s;

        ul{
          max-height: 270px;
          overflow: hidden auto;

          li{
            display: flex;
            align-items: center;
            padding-left:12px;
            line-height: 40px;
            color: #8098b0;

            &:hover{
              color: #fff;
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
