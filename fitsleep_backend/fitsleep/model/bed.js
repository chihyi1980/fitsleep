var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bedSchema = new Schema({
    bedNum: { type: String, required: true },
    personName: { type: String, required: true },
    fitSleepMac: { type: String, required: true },
    power: String,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
});


bedSchema.index({ bedNum: 1, fitSleepMac: 1 }, { unique: true });

bedSchema.set('toJSON', {
    getters: true, transform: function (doc, ret, options) {
        return {
            _id: ret._id,
            bedNum: ret.bedNum,
            personName: ret.personName,
            fitSleepMac: ret.fitSleepMac,
            power: ret.power,
            createAt: ret.createAt && true ? new Date(ret.createAt).Format("yyyy-MM-dd hh:mm:ss") : '',
            updateAt: ret.updateAt && true ? new Date(ret.updateAt).Format("yyyy-MM-dd hh:mm:ss") : ''
        }
    }
});

bedSchema.statics.getAll = function (callback) {
    this
        .find()
        .select('-__v')
        .sort({ updateAt: -1, createAt: -1 })
        .exec(callback);
};

bedSchema.set('collection', 'bed');
module.exports = bedSchema;