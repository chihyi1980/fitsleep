var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bedStatusSchema = new Schema({
    bedNum: { type: String, required: true },
    personName: { type: String, required: true },
    heartRate: { type: String},
    breathRate: { type: String },
    isLeave: { type: String },
    leaveTime: { type: String },
    bodyMove: { type: String },
    bodyMoveValue: { type: String },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});


bedStatusSchema.index({ createAt: 1 });

bedStatusSchema.set('toJSON', {
    getters: true, transform: function (doc, ret, options) {
        return {
            _id: ret._id,
            bedNum: ret.bedNum,
            personName: ret.personName,
            power: ret.power,
            heartRate: ret.heartRate,
            breathRate: ret.breathRate,
            isLeave: ret.isLeave,
            leaveTime: ret.leaveTime,
            bodyMove: ret.bodyMove,
            bodyMoveValue: ret.bodyMoveValue,
            createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss") : '',
            updateAt: ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss") : ''
        }
    }
});

bedStatusSchema.statics.getAll = function (callback) {
    this
        .find()
        .select('-__v')
        .sort({ updateAt: -1, createAt: -1 })
        .exec(callback);
};

bedStatusSchema.set('collection', 'bedStatus');
module.exports = bedStatusSchema;