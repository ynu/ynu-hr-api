const config = require('../config');
const MySQLEvents = require('mysql-events');

const dsn = {
    host:     config.mysqlHost,
    user:     config.mysqlUsername,
    password: config.mysqlPassword,
    debug: true,
};
const mysqlEventWatcher = MySQLEvents(dsn);
const watcher = mysqlEventWatcher.add('test', (oldRow, newRow, event) => {
    console.log(event);
});