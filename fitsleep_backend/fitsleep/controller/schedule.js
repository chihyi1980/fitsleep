var model = require('../model');
var Schedule = model.Schedule;

exports.saveSchedule = function (req, res)
{
    var bedId = req.body.bedId;
    var startDate = req.body.startDate;
    var data = req.body.data;

    Schedule.findOneAndUpdate(
        { bedId: bedId, startDate: startDate }, { $set: { bedId: bedId, startDate: startDate, data: data } },
        { upsert: true },
        function (err, ret) {
        if (err) {
            return res.json(500, { message: err.toString() });
        } else {
            return res.json(200, { message: 'OK' });
        }
    });

}

exports.getSchedule = function (req, res) {
    var bedId = req.body.bedId;
    var startDate = req.body.startDate;

    Schedule.findOne(
        { bedId: bedId, startDate: startDate },
        function (err, ret)
        {
            if (err) {
                return res.json(500, { message: err.toString() });
            } else {
                return res.json(200, ret);
            }
        }
    );
}