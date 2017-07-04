module.exports = {
    port: process.env.PORT || 3000,
    mysqlHost: process.env.MYSQL_HOST || 'localhost',
    mysqlPort: process.env.MYSQL_PORT || 3306,
    mysqlUsername: process.env.MYSQL_USERNAME || 'root',
    mysqlPassword: process.env.MYSQL_PASSWORD || '',
    mysqlDatabase: process.env.MYSQL_DATABASE || 'test',
    jwtSecret: process.env.JWT_SECRET || 'my jwt secret',
    initializationTime: process.env.INITIALIZATION_TIME || 1000,
}