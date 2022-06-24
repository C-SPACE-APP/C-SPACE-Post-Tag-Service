const mysql = require('mysql2/promise');

const establishConnection = async (hasDatabase) =>
{   

    
    if (hasDatabase)
    {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'nikizefanya',
            password: 'everysummertime',
            database:'PostTagService'
        });
    }
    else
    {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'nikizefanya',
            password: 'everysummertime'
        });
    }
    return connection 
}

module.exports =  establishConnection