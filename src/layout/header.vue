<template>
  <div class="ly-header">
    <div class="part-left">
      <p>{{ infor.sellerName }}，欢迎您使用云配商家后台系统!</p>
    </div>
    <div class="part-right">
      <dl class="login-infor">
        <dt>
          <i class="el-icon-user-solid el-icon--left" />
          <span>{{ infor.sellerId }}</span>
          <i class="el-icon-caret-bottom el-icon--right" />
        </dt>
        <dd>
          <ul>
            <li @click="logoutHandler">
              <i class="el-icon-right el-icon--left" /> 退出
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
      this.$jsonp('https://zs.360cec.com/idp/logout',
      ).then( () => {
        window.location.href = '/xxx/logout'
      }).catch(err => {
        console.error(err)
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
          .el-icon-caret-bottom{
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
        .el-icon-user-solid{
          border:1px solid #8098b0;
          padding:1px;
          border-radius: 50%;
        }
        .el-icon-caret-bottom{
          transition: all 0.4s ease-in-out 0s;
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
              .el-icon-right{
                &:after{
                  border-color:#ffffff;
                }
              }
            }
            .el-icon-right{
              position: relative;
              padding-left:5px;
              font-weight: bold;
              &:before{
                position: relative;
                z-index: 1;
              }
              &:after{
                position: absolute;
                left:0px;
                top:-1px;
                width:8px;
                height:13px;
                content:'';
                border:1px solid #8098b0;
              }
            }
          }
        }
      }
    }
  }
}

</style>
