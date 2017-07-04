const ZongJi = require('zongji');

module.exports = (options) => {
    const defaultStartOption = {
        startAtEnd: true,
        includeEvents: ['tablemap', 'writerows', 'updaterows', 'deleterows'],
        includeSchema: { 'my_database': ['allow_table', 'another_table'], 'test': true }
    };
    const defaultCb = () => { console.info('something occurs on database!')};
    const defaultErrorCb = (e) => { console.error('some errors occurs on database!', e)};
    const mysqlOption = options.mysqlOption;
    // const startOption = {...defaultStartOption, ...options.startOption};
    const startOption = Object.assign({}, defaultStartOption, options.startOption);
    console.info(`mysqlOption: ${JSON.stringify(mysqlOption)}`);
    console.info(`startOption: ${JSON.stringify(startOption)}`);
    const zongji = new ZongJi(mysqlOption);
    const cb = options.cb || defaultCb;
    const errorCb = options.cb || defaultErrorCb;
    // Each change to the replication log results in an event
    zongji.on('binlog', function(evt) {
        // ignore tablemap event
        if(evt.getTypeName() != 'TableMap') {
            console.info('binlog event!');
            cb();
            evt.dump();
        }
    });
    zongji.on('error', function(err) {
        console.info('error event!');
        errorCb();
        console.info(`err: ${JSON.stringify(err)}`);
    });
    // Binlog must be started, optionally pass in filters
    zongji.start(startOption);
}