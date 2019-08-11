<template>
  <div class="list">
    <l-menu :activeName="'1'"></l-menu>
    <div class="list-content">
      <div class="list-content-tip">
        <div class="list-content-tip-item">
          <Icon type="ios-sunny-outline"
                size="30" />
          <p>監控中</p>
        </div>
        <div class="list-content-tip-item">
          <Icon type="ios-rainy-outline"
                size="30" />
          <p>翻身提醒</p>
        </div>
        <div class="list-content-tip-item">
          <Icon type="ios-thunderstorm-outline"
                size="30" />
          <p>離床提醒</p>
        </div>
        <div class="list-content-tip-item">
          <Icon type="ios-snow-outline"
                size="30" />
          <p>離線</p>
        </div>
        <div class="list-content-tip-item">
          <Icon type="ios-heart-outline"
                size="30" />
          <p>心跳</p>
        </div>
        <div class="list-content-tip-item">
          <Icon type="ios-cloud-outline"
                size="30" />
          <p>呼吸</p>
        </div>
      </div>
      <div class="list-content-list">
        <div class="list-content-item"
             v-for="(bed, index) in bedList"
             :key="index">
          <p>{{ bed.bedNum }}</p>
          <p>{{ bed.personName }}</p>
          <Icon :type="bed.workstatus | icon"
                size="30" />
          <span class="heart"
                v-if="bed.heartRate">
            <Icon type="ios-heart-outline" />{{ bed.heartRate }}</span>
          <span class="breath"
                v-if="bed.breathRate">
            <Icon type="ios-cloud-outline" />{{ bed.breathRate }}</span>
        </div>
      </div>
    </div>
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
    onLogOut () {
      this.$Message.success('使用者登出成功，正在跳轉登錄頁面...')
      window.localStorage.removeItem('isToken')
      setTimeout(() => {
        this.$router.push({ name: 'SignIn' })
      }, 2000)
    },
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
