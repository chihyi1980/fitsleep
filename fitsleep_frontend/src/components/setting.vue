<template>
  <div class="list">
    <Modal v-model="addModal"
           title="新增床位"
           @on-ok="onSaveAdd">
      <div class="list-modal-item">
        <span>床位編號</span>
        <Input placeholder="請輸入床位編號"
               v-model="models.bedNum"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>病患名稱</span>
        <Input placeholder="請輸入病患名稱"
               v-model="models.personName"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>設備Mac</span>
        <Input placeholder="請輸入設備Mac"
               v-model="models.fitSleepMac"
               size="large" />
      </div>
    </Modal>

    <Modal v-model="editModal"
           title="編輯床位"
           @on-ok="onSaveEdit">
      <div class="list-modal-item">
        <span>床位編號</span>
        <Input placeholder="請輸入床位編號"
               v-model="editModels.bedNum"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>病患名稱</span>
        <Input placeholder="請輸入病患名稱"
               v-model="editModels.personName"
               size="large" />
      </div>
      <div class="list-modal-item">
        <span>設備Mac</span>
        <Input placeholder="請輸入設備Mac"
               v-model="editModels.fitSleepMac"
               size="large" />
      </div>
    </Modal>
    <l-menu :activeName="'2'"></l-menu>
    <div class="list-content">
      <div class="list-content-action">
        <Button type="success"
                @click.native="onAdd"
                icon="md-add">新增</Button>
      </div>
      <Table border
             :columns="columns"
             :data="bedList"></Table>
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
      addModal: false,
      editModal: false,
      theme: 'light',
      bedList: [],
      models: {
        bedNum: undefined,
        personName: undefined,
        fitSleepMac: undefined
      },
      editModels: {
        bedNum: undefined,
        personName: undefined,
        fitSleepMac: undefined
      },
      columns: [
        {
          title: '床位編號',
          key: 'bedNum'
        },
        {
          title: '病患名稱',
          key: 'personName'
        },
        {
          title: '設備Mac',
          key: 'fitSleepMac'
        },
        {
          title: '電量',
          key: 'power'
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
      this.models.bedNum = undefined
      this.models.personName = undefined
      this.models.fitSleepMac = undefined

      this.addModal = true
    },
    onSaveAdd () {
      axios.post('/api/addBed',
        {
          bedNum: this.models.bedNum,
          personName: this.models.personName,
          fitSleepMac: this.models.fitSleepMac
        })
        .then(() => {
          this.$Message.success('床位新增成功')
          this.getBedList()
        })
        .catch(() => {
          this.$Message.error('床位新增失敗')
        })
    },
    onSaveEdit () {
      const data =
        {
          ...this.editModels
        }
      axios.post('/api/updateBed', data)
        .then(() => {
          this.$Message.success('床位編輯成功')
          this.getBedList()
        })
        .catch(() => {
          this.$Message.error('床位編輯失敗')
        })
    },
    getBedList () {
      axios({
        method: 'get',
        url: '/api/getBedList'
      })
        .then(res => {
          this.bedList = res.data.data
        })
        .catch(() => {
          this.$Message.error('獲取床位列表失敗，請稍後重試...')
        })
    },
    onEdit (index) {
      this.editModels = this.bedList[index]
      this.editModal = true
    },
    onRemove (index) {
      const data =
        {
          _id: this.bedList[index]._id
        }

      axios.post('/api/delBed', data)
        .then(() => {
          this.$Message.success('刪除床位成功')
          this.getBedList()
        })
        .catch(() => {
          this.$Message.error('刪除床位失敗')
        })
    }
  },
  mounted () {
    this.getBedList()
  }
}
</script>
<style lang="scss" scoped>
.list {
  height: 100vh;
  display: flex;

  .ivu-menu {
    height: 100%;
    position: relative;
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

  .menu-user {
    position: absolute;
    bottom: 5%;
    text-align: center;
    width: 100%;

    p {
      margin-bottom: 10px;
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
