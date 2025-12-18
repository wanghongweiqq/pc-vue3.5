<template>
  <aside class="ly-aside">
    <i
      :class="['btn-menu',isCollapse? 'el-icon-s-unfold':'el-icon-s-fold']"
      @click="menuToggle"
    />
    <!-- <router-link
      :class="['logo',isCollapse?'logo-small':'logo-big']"
      to="/demo/index"
    /> -->
    <el-menu
      unique-opened
      :collapse="isCollapse"
      :default-active="defaultActive"
    >
      <el-submenu
        v-for="(item,index) in listMenu"
        :key="index"
        :index="String(index+1)"
      >
        <template #title>
          <i :class="item.icon" />
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.name"
          :index="subItem.fullPath"
          :title="subItem.fullPath"
          @click="goPage(subItem)"
        >
          {{ subItem.meta.title }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </aside>
</template>
<script>
import routers from '@/router'
// import { mapActions } from 'vuex'

export default {
  name: 'LyAside',
  data () {
    return {
      listMenu: [],
      listPermission: window.BSGlobal && window.BSGlobal.listMenu ? window.BSGlobal.listMenu : {},
      defaultActive: null,
      isCollapse: false
    }
  },
  watch: {
    $route () {
      this.checkDefaultActive()
    },
  },
  created () {
    this.getMenuList()
  },
  methods: {
    // 获取菜单列表
    getMenuList () {
      let list = []
      routers.options.routes.map((item) => {
        let arr = []
        item.children && item.children.map((subItem) => {
          let obj = subItem.meta
          if(obj) {
            if (obj.hidden) {
              return
            }
            if (this.listPermission[obj.key]) {
              if(obj.notvue) {
                subItem.fullPath = subItem.path
              }else{
                if(subItem.path.indexOf('/') === 0) {
                  subItem.fullPath = item.path + subItem.path
                }else{
                  subItem.fullPath = item.path + '/' + subItem.path
                }
              }
              arr.push(subItem)
            }
          }
        })
        if (arr.length > 0) {
          item.children = arr
          list.push(item)
        }
      })
      this.listMenu = list
      this.checkDefaultActive()
    },
    // 获取菜单激活值
    checkDefaultActive () {
      this.defaultActive = null
      // history路由
      let urlWindow = window.location.pathname
      // hash路由
      // if ( window.location.hash && window.location.hash.split('#').length > 1) {
      //   urlWindow = window.location.hash.split('#')[1]
      // }
      for (let i in this.listMenu) {
        for (let h in this.listMenu[i].children) {
          let urlItem = this.listMenu[i].children[h].fullPath
          if (urlWindow && urlItem && urlWindow.indexOf(urlItem) !== -1) {
            this.defaultActive = urlItem
            return
          }
        }
      }
    },
    goPage (subItem) {
      if(subItem.meta.notvue) {
        window.open(subItem.path)
      }else{
        this.$router.push({ name: subItem.name })
      }
    },
    menuToggle () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="scss">
@import "../assets/css/global.scss";

.ly-aside {
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: $menu-bg;
  transition: all 0.5s;
  scrollbar-color: rgba(255, 255, 255, 0.4) $menu-bg;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: $menu-bg;
  }

  .btn-menu {
    position: fixed;
    top: 8px;
    left: $menuWidth+15;
    font-size: 34px;
    color: $themeColor;
    cursor: pointer;
    transition: all 0.4s ease-in-out 0s;

    &.el-icon-s-unfold {
      left: $menuWidthCollapse+15;
    }
  }

  .logo {
    display: block;
    height: 50px;
    background-color: $themeColor;
    background-repeat: no-repeat;
    background-position: center center;

    &.logo-big {
      background-image: url(../assets/images/logo_big.png);
      background-size: 79% auto;
    }

    &.logo-small {
      background-image: url(../assets/images/logo_small.png);
    }
  }

  .el-menu {
    width: $menuWidth;
    font-weight: 700;
    color: $menu-font;
    background: $menu-bg;
    border: none;

    &.el-menu--collapse {
      width: $menuWidthCollapse;
    }

    .el-submenu__title {
      height: 46px;
      font-size: 13px;
      line-height: 46px;

      span {
        color: $menu-font;
      }

      i[class^=el-icon-] {
        font-size: 16px;
        color: $themeColor;
      }

      i.el-submenu__icon-arrow {
        font-size: 16px;
        color: $themeColor;
      }

      &:hover {
        background: $menu-bg-active;

        span {
          color: $menu-font-active;
        }

        i.el-submenu__icon-arrow {
          color: $menu-font-active;
        }
      }
    }

    .is-active {
      .el-submenu__title {
        background: $menu-bg-active;

        span {
          color: $menu-font-active;
        }

        i.el-submenu__icon-arrow {
          color: $menu-font-active;
        }
      }
    }

    .el-menu-item {
      height: 39px;
      padding: 0 0 0 50px;
      font-size: 13px;
      line-height: 39px;
      color: $menu-font;

      &:hover,
      &:focus,
      &.is-active {
        color: #31c0be;
        background: transparent;
      }
    }
  }
}

.el-menu--vertical {
  .el-menu--popup {
    padding: 0;
    margin: 0;
    background-color: $menu-bg;

    .el-menu-item {
      height: 39px;
      font-size: 13px;
      line-height: 39px;
      color: $menu-font;

      &:hover,
      &:focus,
      &.is-active {
        color: #31c0be;
        background: transparent;
      }
    }
  }
}
</style>
