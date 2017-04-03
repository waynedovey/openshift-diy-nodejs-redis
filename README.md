openshift-diy-nodejs-redis
==========================

Usage
-----

Use Redis in Node.js
--------------------

Environment variables `REDIS_IP` (which is based on `$OPENSHIFT_DIY_IP` when app is started) and `REDIS_PORT` are defined. Simply connect to Redis server with `REDIS_IP` and `REDIS_PORT`. For example, using [node-redis](https://github.com/mranney/node_redis)

    var redis = require("redis");
    var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_IP);
