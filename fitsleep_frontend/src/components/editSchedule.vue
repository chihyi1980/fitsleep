<template>
  <div>
    <b-modal id="modalPrevent"
             ref="modal"
             title="編輯"
             @ok="handleOk"
             @shown="setContent">
        <form @submit.stop.prevent="handleSubmit">
        <b-form-group horizontal
                :label-cols="2"
                label="日期: "
                label-class="text-sm-right"
                label-for="selectedDate">
          <b-form-select id="selectedDate" v-model="date" :options="weekDates" class="mb-3" />
        </b-form-group>
        <b-form-group horizontal
                :label-cols="2"
                label="項目: "
                label-class="text-sm-right"
                label-for="selectedEvent">
          <b-form-select id="selectedEvent" v-model="event" :options="events" class="mb-3" />
        </b-form-group>
        <b-form-group horizontal
                :label-cols="2"
                label="內容: "
                label-class="text-sm-right"
                label-for="selectedContent">
          <b-form-input id="selectedContent" type="text" placeholder="請輸入內容" v-model="content">
          </b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'editCompenent',
  props: ['schedule', 'bedList', 'selectedBed', 'selectedDate', 'selectedEvent', 'weekDates', 'events'],
  data () {
    return {
      date: this.selectedDate,
      event: this.selectedEvent.value,
      content: ''
    }
  },
  methods: {
    setContent () {
      let ymdDate = this.$parent.getYmd(this.date)
      let content = ''
      if (undefined !== this.schedule[ymdDate]) {
        if (undefined !== this.schedule[ymdDate][this.event]) {
          content = this.schedule[ymdDate][this.event]
        }
      }
      this.content = content
    },
    handleOk (evt) {
      evt.preventDefault()
      this.$refs.modal.hide()
      this.handleSubmit()
    },
    handleSubmit () {
      this.schedule[this.event] = this.content
      const data = {
        bedId: this.selectedBed,
        startDate: this.$parent.getYmd(this.selectedDate),
        data: JSON.stringify(this.schedule)
      }
      axios.post('/api/saveSchedule', data)
        .then(() => {
          this.$Message.success('更新內容成功')
          this.$parent.getSchedule()
        })
        .catch(() => {
          this.$Message.error('更新內容失敗')
        })
    }
  },
  watch: {
    selectedDate (val) {
      this.date = val
    },
    selectedEvent (val) {
      this.event = val.value
    }
  }
}
</script>
