var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    bedId: { type: String, required: true },
    startDate: { type: String, required: true },
    data: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});

scheduleSchema.index({ createAt: 1 });

scheduleSchema.set('toJSON', {
    getters: true, transform: function (doc, ret, options) {
        return {
            _id: ret._id,
            bedId: ret.bedId,
            startDate: ret.startDate,
            data: ret.data,
            createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss") : '',
            updateAt: ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss") : ''
        }
    }
});

scheduleSchema.set('collection', 'schedule');
module.exports = scheduleSchema;