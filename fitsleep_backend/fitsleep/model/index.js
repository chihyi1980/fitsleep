var mongo = require('../config/mongodb'),
    db_conn = mongo.db_conn;

module.exports = {
    User: db_conn.model('User', require('./user')),
    Bed: db_conn.model('Bed', require('./bed')),
    BedStatus: db_conn.model('BedStatus', require('./bedStatus')),
    Schedule: db_conn.model('Schedule', require('./schedule')),
};
