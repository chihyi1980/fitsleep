<template>
  <div class="list">
    <Modal v-model="addUser"
           title="新增帳戶"
           @on-ok="onSaveAdd">
      <div class="list-modal-item">
        <span>帳戶ＩＤ</span>
        <Input placeholder="請輸入帳戶Id"
               v-model="addUsers.name"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>帳戶名稱</span>
        <Input placeholder="請輸入帳戶名稱"
               v-model="addUsers.nickname"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>群組名稱</span>
        <Input placeholder="請輸入帳戶群組"
               v-model="addUsers.group"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>電話號碼</span>
        <Input placeholder="請輸入帳戶電話號碼"
               v-model="addUsers.phone"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>電子郵箱</span>
        <Input placeholder="請輸入帳戶電子郵箱"
               v-model="addUsers.email"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>帳戶密碼</span>
        <Input type="password"
               placeholder="請輸入帳戶密碼，若空白則表示不改變"
               v-model="addUsers.pwd"
               size="large" />
      </div>
    </Modal>

    <Modal v-model="editUser"
           title="編輯帳戶"
           @on-ok="onSaveEdit">
      <div class="list-modal-item">
        <span>帳戶Id</span>
        <Input placeholder="請輸入帳戶Id"
               v-model="editUsers.name"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>帳戶名稱</span>
        <Input placeholder="請輸入帳戶名稱"
               v-model="editUsers.nickname"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>群組名稱</span>
        <Input placeholder="請輸入帳戶群組"
               v-model="editUsers.group"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>電話號碼</span>
        <Input placeholder="請輸入帳戶電話號碼"
               v-model="editUsers.phone"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>電子郵箱</span>
        <Input placeholder="請輸入帳戶電子郵箱"
               v-model="editUsers.email"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>帳戶密碼</span>
        <Input type="password"
               placeholder="請輸入帳戶密碼，若空白則表示不改變"
               v-model="editUsers.pwd"
               size="large" />
      </div>
    </Modal>
    <l-menu :activeName="'3'"></l-menu>
    <div class="list-content">
      <div class="list-content-action">
        <Button type="success"
                @click.native="onAdd"
                icon="md-add">新增</Button>
      </div>
      <Table border
             :columns="columns"
             :data="userList"></Table>
    </div>
  </div>
</template>
<script>
import listMenu from './menu'
import axios from 'axios'
import md5 from 'js-md5'

export default {
  components: {
    'l-menu': listMenu
  },
  data () {
    return {
      tokenName: window.localStorage.getItem('isToken'),
      addUser: false,
      editUser: false,
      theme: 'light',
      userList: [],
      addUsers: {
        name: undefined,
        nickname: undefined,
        group: undefined,
        phone: undefined,
        email: undefined,
        pwd: undefined
      },
      editUsers: {
        name: undefined,
        nickname: undefined,
        group: undefined,
        phone: undefined,
        email: undefined,
        pwd: undefined
      },
      columns: [
        {
          title: '帳戶Id',
          key: 'name'
        },
        {
          title: '帳戶名稱',
          key: 'nickname'
        },
        {
          title: '群組',
          key: 'group'
        },
        {
          title: '電話號碼',
          key: 'phone'
        },
        {
          title: '電子郵箱',
          key: 'email'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.onEdit(params.index)
                  }
                }
              }, '編輯'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.onRemove(params.index)
                  }
                }
              }, '刪除')
            ])
          }
        }
      ]
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
    remove (index) {
      this.data6.splice(index, 1)
    },
    onAdd () {
      this.addUser = true
    },
    onSaveAdd () {
      this.addUsers.pwd = md5(this.addUsers.pwd)

      axios.post('/api/addUser',
        {
          ...this.addUsers
        })
        .then(() => {
          this.$Message.success('帳戶新增成功')
          this.getUserList()
        })
        .catch(() => {
          this.$Message.error('帳戶新增失敗')
        })
    },
    onSaveEdit () {
      this.editUsers.pwd = md5(this.editUsers.pwd)
      const data =
        {
          ...this.editUsers
        }
      axios.post('/api/updateUser', data)
        .then(() => {
          this.$Message.success('帳戶編輯成功')
          this.getUserList()
        })
        .catch(() => {
          this.$Message.error('帳戶編輯失敗')
        })
    },
    getUserList () {
      axios({
        method: 'get',
        url: '/api/getUserList'
      })
        .then(res => {
          this.userList = res.data.data
        })
        .catch(() => {
          this.$Message.error('獲取帳戶列表失敗，請稍後重試...')
        })
    },
    onEdit (index) {
      this.editUsers = this.userList[index]
      this.editUser = true
    },
    onRemove (index) {
      const data =
        {
          _id: this.userList[index]._id
        }
      axios.post('/api/delUser', data)
        .then(() => {
          this.$Message.success('刪除用戶成功')
          this.getUserList()
        })
        .catch(() => {
          this.$Message.error('刪除用戶失敗')
        })
    }
  },
  mounted () {
    this.getUserList()
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

    .ivu-table-wrapper {
      width: calc(100vw - 400px);
      margin-left: 80px;
      margin-top: 20px;
    }

    &-action {
      width: calc(100vw - 400px);
      margin-left: 80px;
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.list-modal {
  &-item {
    margin-bottom: 20px;
    .ivu-input-wrapper {
      margin-left: 30px;
      width: 300px;
    }
  }
}
</style>
