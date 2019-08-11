<template>
  <div class="list">
    <l-menu :activeName="'6'"></l-menu>
    <b-container>
      <b-row align-v="center">
          <b-col>
            <b-row align-h="center">
              <h2>管理照顧服務</h2>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="selectedBed">請選擇床位</label>
                </div>
                <select class="custom-select" id="selectedBed" v-model="selectedBed" @change="onChangeBed">
                  <option v-for="bed in bedList" :key="bed._id" :value="bed._id">{{ bed.bedNum }}</option>
                </select>
              </div>
              <!-- <b-form-select id="selectedBed" v-model="selectedBed" :options="bedNumList" @change="onChangeBed($event)" class="mb-3" /> -->
            </b-row>
            <b-row class="mb-3" align-h="center">
              <b-btn @click="prevWeek">上一週</b-btn>
              <b-btn v-b-modal.modalPrevent variant="primary">輸入事件內容</b-btn>
              <Edit ref="editCompoment" :schedule="schedule" :bedList="bedList" :selectedBed="selectedBed" :weekDates="weekDates" :events="events" :selectedDate="selectedDate" :selectedEvent="selectedEvent"></Edit>
              <b-btn @click="nextWeek">下一週</b-btn>
            </b-row>
            <b-row class="mb-3" align-h="center">
              <table class="table table-bordered table-hover table-striped">
                  <thead>
                    <tr>
                        <th>日期</th>
                        <th v-for="day in weekDates" :key="day">{{ day }}</th>
                    </tr>
                    <tr>
                        <th>項目\星期</th>
                        <th v-for="day in weekDays" :key="day">{{ day }}</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(event, event_index) in events" :key="event.value">
                        <th>{{ event.text }}</th>
                        <td v-for="(date, date_index) in weekDatesEvents" :key="date_index" @click="tdClickHandler(event_index, date_index)"
                          v-b-tooltip.hover :title="date_index + ' ' + event.text">
                          {{ weekDatesEvents[date_index][event.value] }}
                        </td>
                      </tr>
                  </tbody>
                </table>
          </b-row>
          </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import listMenu from './menu'
import axios from 'axios'
import Edit from './editSchedule'
import moment from 'moment'

export default {
  components: {
    Edit,
    'l-menu': listMenu
  },
  data () {
    return {
      bedList: [],
      interval: undefined,
      events: [
        { value: 'event_1', text: '體溫(度)' },
        { value: 'event_2', text: '早餐' },
        { value: 'event_3', text: '午餐' },
        { value: 'event_4', text: '點心' },
        { value: 'event_5', text: '晚餐' },
        { value: 'event_6', text: '洗臉' },
        { value: 'event_7', text: '刷牙(次)' },
        { value: 'event_8', text: '更換衣服(次)' },
        { value: 'event_9', text: '洗澡' },
        { value: 'event_10', text: '洗頭' },
        { value: 'event_11', text: '排便(次)' },
        { value: 'event_12', text: '更換尿布(次)' },
        { value: 'event_13', text: '更換床單(次)' },
        { value: 'event_14', text: '情緒狀況' }
      ],
      weekDays: {sun: '星期日', mon: '星期一', tue: '星期二', wed: '星期三', thu: '星期四', fri: '星期五', sat: '星期六'},
      selectedBed: '',
      selectedDate: '',
      selectedEvent: '',
      schedule: {},
      weekDatesEvents: {}
    }
  },
  methods: {
    prevWeek () {
      let prevWeekDate = this.weekStartDate.add(-7, 'days').format('YYYY-MM-DD')
      this.$router.push({path: 'serv', query: { bed: this.selectedBed, date: prevWeekDate }})
      this.setSelectedBed()
    },
    nextWeek () {
      let nextWeekDate = this.weekStartDate.add(7, 'days').format('YYYY-MM-DD')
      this.$router.push({path: 'serv', query: { bed: this.selectedBed, date: nextWeekDate }})
      this.setSelectedBed()
    },
    onChangeBed (event) {
      this.$router.push({path: 'serv', query: { bed: event.target.value, date: this.weekStartDate.format('YYYY-MM-DD') }})
      this.setSelectedBed()
    },
    onLogOut () {
      this.$Message.success('使用者登出成功，正在跳轉登錄頁面...')
      window.localStorage.removeItem('isToken')
      setTimeout(() => {
        this.$router.push({ name: 'SignIn' })
      }, 2000)
    },
    getBedList () {
      axios({
        method: 'get',
        url: '/api/getBedList'
      })
        .then(res => {
          this.bedList = res.data.data
          this.setSelectedBed()
        })
        .catch(() => {
          this.$Message.error('獲取床位狀態失敗，請稍後重試...')
        })
    },
    getYmd (date) {
      return date.replace(/\//g, '')
    },
    getSchedule (startDate) {
      let $vm = this
      if (startDate === undefined) {
        $vm.weekDates.forEach(function (date) {
          let ymdDate = $vm.getYmd(date)
          const data = {
            bedId: $vm.selectedBed,
            startDate: ymdDate
          }
          $vm.getScheduleFromApi(data)
        })
      } else {
        const data = {
          bedId: $vm.selectedBed,
          startDate: startDate
        }
        $vm.getScheduleFromApi(data)
      }
    },
    getScheduleFromApi (postData) {
      const data = {
        bedId: postData.bedId,
        startDate: postData.startDate
      }
      axios({
        method: 'post',
        url: '/api/getSchedule',
        data: data
      })
        .then(res => {
          if (res.data !== null) {
            this.schedule[postData.startDate] = JSON.parse(res.data.data)
            this.updateUI(postData.startDate)
          }
        })
        .catch(err => {
          console.log(err)
          this.$Message.error('獲取資料失敗，請稍後重試...')
        })
    },
    setSelectedBed () {
      if (this.$route.query.bed !== undefined) {
        this.selectedBed = this.$route.query.bed
      } else {
        this.selectedBed = this.bedList[0]._id
      }
      this.setWeekdatesEvents()
      this.getSchedule()
    },
    setWeekdatesEvents () {
      let $vm = this
      $vm.weekDatesEvents = {}
      this.weekDates.forEach(function (date) {
        let ymdDate = $vm.getYmd(date)
        $vm.events.forEach(function (event) {
          if ($vm.weekDatesEvents[ymdDate] === undefined) {
            $vm.weekDatesEvents[ymdDate] = {}
          }
          if ($vm.weekDatesEvents[ymdDate][event.value] === undefined) {
            $vm.weekDatesEvents[ymdDate][event.value] = ''
          }
        })
      })
    },
    tdClickHandler (eventIndex, dateIndex) {
      var year = dateIndex.substring(0, 4)
      var month = dateIndex.substring(4, 6)
      var day = dateIndex.substring(6, 8)
      let displayDate = year + '/' + month + '/' + day
      this.selectedEvent = this.events[eventIndex]
      this.selectedDate = displayDate
      this.$refs.editCompoment.$refs.modal.show()
    },
    updateUI (startDate) {
      let $vm = this
      let schedule = this.schedule
      for (var key in schedule[startDate]) {
        $vm.weekDatesEvents[startDate][key] = schedule[startDate][key]
      }
      this.$forceUpdate()
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
  computed: {
    weekStartDate () {
      if (this.$route.query.date !== undefined) {
        return moment(this.$route.query.date)
      }
      return moment()
    },
    weekDates () {
      let weekStartDate = this.weekStartDate
      return [
        weekStartDate.day(0).format('YYYY/MM/DD'),
        weekStartDate.day(1).format('YYYY/MM/DD'),
        weekStartDate.day(2).format('YYYY/MM/DD'),
        weekStartDate.day(3).format('YYYY/MM/DD'),
        weekStartDate.day(4).format('YYYY/MM/DD'),
        weekStartDate.day(5).format('YYYY/MM/DD'),
        weekStartDate.day(6).format('YYYY/MM/DD')
      ]
    }
  },
  mounted () {
    this.getBedList()
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
