var model = require('../model');
var Bed = model.Bed;
var BedStatus = model.BedStatus;
var async = require('async');
var jwtUtil = require('../util/jwtUtil.js');
var APP_ID = 'ed7fd9fcf4ad47eaa4e4a35df61cadd4';
var mStatusPeriod = 120 * 1000;

var mMapBeds = {};
var mReqBody = {};
var mReqBodyStr = '';

function loadBeds(next)
{
    Bed.find({}, function (err, ret) {
        if (err) {
            console.log(err.toString());
        } else if (ret) {
            for (var i = 0; i < ret.length; i++)
            {
                mMapBeds[ret[i]['fitSleepMac']] = ret[i];
            }
            next();
        }
    });
}

function sendFitSleepRes(req, res)
{
    var signature = jwtUtil.genFtiSleepSign(mReqBodyStr);

    var resHeader =
        {
            'Content-Type': 'text/plain',
            'appid': APP_ID,
            'signMethod': 'aksk',
            'signature': signature,
            'signTimestamp': new Date().format('yyyyMMddHHmmss'),
            'authorization': signature
        };

    var resBody =
        {
            'returnCode': 0
        };

    res.writeHead(200, resHeader);
    res.write(JSON.stringify(resBody));
    res.end();

}

function updateBattery(mac, batteryValue)
{
    Bed.findOneAndUpdate({ fitSleepMac: mac }, { $set: { power: batteryValue } }, function (err, ret) {
        if (err) {
            console.log(err.toString());
        }
    });
}


function saveBedStatus(next)
{

    console.log(JSON.stringify(mReqBody));

    var deviceData = mReqBody.deviceData;
    
    if (!deviceData)
        return;
    
    for (var mac in deviceData)
    {
        if (mMapBeds[mac])
        {

            var newBedStatus =
                {
                    bedNum: mMapBeds[mac].bedNum,
                    personName: mMapBeds[mac].personName,
                    heartRate: deviceData[mac][0].heartRate,
                    breathRate: deviceData[mac][0].breatRate,
                    isLeave: deviceData[mac][0].noMan,
                    leaveTime: deviceData[mac][0].noManTime,
                    bodyMove: deviceData[mac][0].bodyMove,
                    bodyMoveValue: deviceData[mac][0].bodyMoveValue,
                };
            new BedStatus(newBedStatus).save(function (err, ret)
            {
                if (err)
                {
                    console.log(err.toString());
                }
            });

            updateBattery(mac, deviceData[mac][0].batteryValue);
        }
    }

    next();
}

function getBedStatusData(data)
{
    var aryStatus = [];
    for (var mac in mMapBeds)
    {
    
        var newStatus =
            {
                bedNum: mMapBeds[mac]['bedNum'],
                personName: mMapBeds[mac]['personName'],
                fitSleepMac: mMapBeds[mac]['fitSleepMac'],
                heartRate: '',
                breathRate:'',
                workstatus: 3,
            };
        for (var i = 0; i < data.length; i++)
        {
            if (data[i]['bedNum'] == mMapBeds[mac]['bedNum'])
            {
                newStatus['heartRate'] = data[i]['heartRate'];
                newStatus['breathRate'] = data[i]['breathRate'];
                if (data[i]['isLeave'] == 'Y' || data[i]['isLeave'] == 'y') {
                    newStatus['workstatus'] = 2;
                } else if (data[i]['bodyMove'] == 'Y' || data[i]['bodyMove'] == 'y') {
                    newStatus['workstatus'] = 1;
                } else {
                    newStatus['workstatus'] = 0;
                }
                break;
            }
        }

        aryStatus.push(newStatus);
    }

    aryStatus.sort(function (a, b) {
        return a.bedNum.localeCompare(b.bedNum, 'en');
    });

    var ObjStatus = {};
    ObjStatus['status'] = 'OK';
    ObjStatus['data'] = aryStatus;

    return ObjStatus;
}

function loadReqBody(req, next) {

    var body = [];
    req.on('error', function (err) {
        console.error(err);
    }).on('data', function (chunk) {
        body.push(chunk);
    }).on('end', function () {
        mReqBodyStr = Buffer.concat(body).toString();
        mReqBody = JSON.parse(mReqBodyStr);
        
        next();
    });
}

function clearResCache(res)
{
    // Disable caching for content files
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
}

exports.addBedStatus = function (req, res) {
    async.series(
        [
            function (next) {
                loadReqBody(req, next);
            },
            function (next)
            {
                loadBeds(next);
            },
            function (next)
            {
                saveBedStatus(next);
            },
            function (next)
            {
                sendFitSleepRes(req, res);
            }
        ]
    );
}


exports.getBedStatusList = function (req, res) {
    var startTimeInMs = Date.now() - mStatusPeriod;
    BedStatus.find({ createAt: { '$gte': new Date(startTimeInMs) } })
        .sort({ createAt: -1 })
        .exec(function (err, ret) {
            clearResCache(res);
            if (err) {
                return res.json(500, { message: err.toString() });
            } else {
                return res.json(200, getBedStatusData(ret));
            }

        });
}
