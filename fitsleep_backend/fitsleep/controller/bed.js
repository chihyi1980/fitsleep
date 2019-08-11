var model = require('../model');
var Bed = model.Bed;

function clearResCache(res) {
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
}

exports.addNewBed = function (req, res) {
    var newBed =
        {
            bedNum: req.body.bedNum,
            personName: req.body.personName,
            fitSleepMac: req.body.fitSleepMac.toLowerCase()
        };

    Bed.findOne({ bedNum: req.body.bedNum })
        .exec(function (err, ret) {
            if (ret) {
                return res.json(409, { message: 'Bed Number already exist' });
            } else {
                Bed.findOne({ fitSleepMac: req.body.fitSleepMac.toLowerCase() })
                    .exec(function (err2, ret2) {
                        if (ret2) {
                            return res.json(409, { message: 'mac address already exist' });
                        } else {
                            new Bed(newBed).save(function (err3, ret3) {
                                if (err3) {
                                    res.json(500, { message: err3.toString() });
                                } else {
                                    res.json(201, { message: 'Created' });
                                }
                            });
                        }
                    });
            }
        });
}

exports.updateBed = function (req, res) {
    var bedId = req.body._id;
    var bedNum = req.body.bedNum;
    var personName = req.body.personName;
    var fitSleepMac = req.body.fitSleepMac.toLowerCase();

    Bed.findByIdAndUpdate({ _id: bedId }, { $set: { bedNum: bedNum, personName: personName, fitSleepMac: fitSleepMac } }, function (err, ret)
    {
        if (err) {
            return res.json(500, { message: 'id is not exist' });
        } else if (ret == null) {
            return res.json(500, { message: 'id is not exist' });
        } else {
            return res.json(200, { message: 'OK' });
        }
    });
}

exports.delBed = function (req, res) {
    var bedId = req.body._id;
    Bed.findOneAndRemove({ _id: bedId }, function (err, ret) {

        if (err) {
            return res.json(500, { message: 'id is not exist' });

        } else if (ret == null) {

            return res.json(500, { message: 'id is not exist' });
        } else {
            return res.json(200, { message: 'OK' });
        }
    });


}

exports.listBeds = function (req, res) {
    Bed.find({}, function (err, ret) {
        if (err) {
            return res.json(500, { message: err.toString() });
        } else {

            clearResCache(res);

            var ans = {};
            ans['status'] = 'OK';
            ans['data'] = ret;

            return res.json(200, ans);
        }
    });
}