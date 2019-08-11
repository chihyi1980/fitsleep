<template>
  <div class="list-menu">
    <Menu :theme="theme3"
          :active-name="activeName">
      <div class="logo">
        <img src="../assets/logo.png"
              alt="">
      </div>
      <MenuGroup>
        <MenuItem name="1"
                  @click.native="$router.push({ name: 'List' })">
        <Icon type="md-document" />
        即時狀態
        </MenuItem>
        <MenuItem name="2"
                  @click.native="$router.push({ name: 'Setting' })">
        <Icon type="md-chatboxes" />
        床位設置
        </MenuItem>
        <MenuItem name="3"
                  @click.native="$router.push({ name: 'Users' })">
        <Icon type="ios-people" />
        帳戶群組
        </MenuItem>
        <MenuItem name="4"
                  @click.native="$router.push({ name: 'Wet' })">
        <Icon type="ios-water" />
        尿濕偵測
        </MenuItem>
        <MenuItem name="5"
                  @click.native="$router.push({ name: 'Temp' })">
        <Icon type="md-thermometer" />
        溫度/血壓紀錄
        </MenuItem>
        <MenuItem name="6"
                  @click.native="$router.push({ name: 'Serv' })">
        <Icon type="md-contacts" />
        管理照顧服務
        </MenuItem>
      </MenuGroup>

      <div class="hdit-logo">
        <img src="../assets/hdit-logo.jpg"
              alt="">
      </div>

      <div class="menu-user">
        <p>使用者：{{ tokenName }}</p>
        <Button @click.native="onLogOut">登出</Button>
      </div>
    </Menu>
  </div>
</template>
<script>
export default {
  props: ['activeName'],
  data () {
    return {
      tokenName: window.localStorage.getItem('isToken'),
      theme3: 'light',
      interval: undefined
    }
  },
  methods: {
    onLogOut () {
      this.$Message.success('使用者登出成功，正在跳轉登錄頁面...')
      window.localStorage.removeItem('isToken')
      setTimeout(() => {
        this.$router.push({ name: 'SignIn' })
      }, 2000)
    }
  },
  filters: {
    icon (icon) {
      switch (icon) {
        case 0:
          return 'ios-sunny-outline'
        case 1:
          return 'ios-rainy-outline'
        case 2:
          return 'ios-thunderstorm-outline'
        case 3:
          return 'ios-snow-outline'
      }
    }
  },
  mounted () {
  },
  beforeDestroy () {
    window.clearInterval(this.interval)
  }
}
</script>
<style lang="scss" scoped>
.list {
  height: 100vh;
  display: flex;

  .ivu-menu {
    height: 100%;
  }

  .menu-user {
    position: absolute;
    bottom: 5%;
    text-align: center;
    width: 100%;

    p {
      margin-bottom: 10px;
    }
  }

  .hdit-logo {
    position: absolute;
    bottom: 15%;
    text-align: center;
    width: 100px;
    margin-left: 70px;

    img {
      width: 100%;
    }
  }

  .logo {
    width: 150px;
    margin-left: 45px;

    img {
      width: 100%;
    }
  }

  &-content {
    width: calc(100vw - 240px);
    height: 100vh;
    overflow: auto;

    &-list {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      height: 80vh;
      margin-top: 20px;
      justify-content: space-evenly;
    }

    &-item {
      flex: 0 0 18%;
      height: 180px;
      border: 1px solid #f0f0f0;
      border-radius: 5px;
      box-shadow: 2px 2px 2px rgba($color: #eee, $alpha: 0.3);
      position: relative;

      .ivu-icon {
        margin-top: 20px;
      }

      p {
        font-size: 14px;
        margin-top: 10px;
      }

      p + p {
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
      }

      span {
        position: absolute;

        .ivu-icon {
          margin-top: 0;
          margin-right: 5px;
        }

        &.breath {
          top: 10px;
          right: 10px;
          color: #013c80;
          font-size: 12px;
        }

        &.heart {
          top: 10px;
          left: 10px;
          color: #cd0a20;
          font-size: 12px;
        }
      }
    }

    &-tip {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }
  }
}
</style>
