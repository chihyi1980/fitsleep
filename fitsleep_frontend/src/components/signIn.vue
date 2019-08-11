<template>
  <div class="sign">
    <div class="sign-logo">
      <img src="../assets/logo.png"
           alt="">
    </div>
    <div class="sign-title">
      <h3>{{ $t('title') }}</h3>
    </div>
    <div class="sign-action">
      <Row>
        <Col span="18"
             offset="3">
        <Card dis-hover
              :bordered="false">
          <div>
            <Input prefix="ios-contact"
                   placeholder="請輸入帳號"
                   size="large"
                   v-model="userName"
                   style="width: 300px; margin-top: 20px;" />
          </div>
          <div style="margin-top: 6px">
            <Input prefix="ios-lock"
                   placeholder="請輸入密碼"
                   size="large"
                   v-model="pwd"
                   type="password"
                   style="width: 300px;margin-top: 10px;" />
          </div>
          <Button type="success"
                  :loading="isLoading"
                  :disabled="!userName || !pwd"
                  @click.native="onLogIn">{{ $t('signIn') }}</Button>
        </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'

export default {
  data () {
    return {
      userName: undefined,
      pwd: undefined,
      isLoading: false
    }
  },
  methods: {
    onLogIn () {
      this.isLoading = true
      axios.post('/api/login',
        {
          userName: this.userName,
          pwd: md5(this.pwd)
        })
        .then(() => {
          this.isLoading = false
          window.localStorage.setItem('isToken', this.userName)
          this.$Message.success('登錄成功，正在跳轉...')

          setTimeout(() => {
            this.$router.push({ name: 'List' })
          }, 2000)
        })
        .catch(() => {
          this.isLoading = false
          this.$Message.error('賬號或密碼錯誤，請重試')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.sign {
  &-logo {
    width: 300px;
    margin: 0 auto;

    img {
      width: 100%;
    }
  }

  &-title {
    margin-top: 30px;
    font-size: 32px;
  }

  .ivu-btn {
    width: 120px;
    margin-top: 40px;
  }
}
</style>
