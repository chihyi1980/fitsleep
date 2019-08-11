<template>
  <div class="list">
    <l-menu :activeName="'4'"></l-menu>
  </div>
</template>
<script>
import listMenu from './menu'
import axios from 'axios'

export default {
  components: {
    'l-menu': listMenu
  },
  data () {
    return {
      tokenName: window.localStorage.getItem('isToken'),
      theme3: 'light',
      bedList: [],
      interval: undefined
    }
  },
  methods: {
    getBedStatus () {
      axios({
        method: 'get',
        url: '/api/getBedStatusList'
      })
        .then(res => {
          this.bedList = res.data.data
        })
        .catch(() => {
          this.$Message.error('獲取床位狀態失敗，請稍後重試...')
        })
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
    this.getBedStatus()

    this.interval = setInterval(() => {
      this.getBedStatus()
    }, 30000)
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
    width: 100px;
    margin-left: 70px;

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
          font-size: 24px;
        }

        &.heart {
          top: 10px;
          left: 10px;
          color: #cd0a20;
          font-size: 24px;
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
