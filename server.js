#!/bin/env node
//  OpenShift sample Node application

var express = require('express');
var fs      = require('fs');

//var redis = require("redis"),
//var redis = require('redis-url').connect();
var redis = require('redis-url').parse('redis://:6rHRYRaRwUb5X434@172.30.116.33:6379')

    //redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_IP);
    //redisClient = Redis.new(:url => "redis://:6rHRYRaRwUb5X434@redis:6379")
//require("redis-url").parse('redis://:6rHRYRaRwUb5X434@172.30.116.33:6379')

redis.on("error", function (err) {
  console.error("REDIS Error " + err);
});

redis.set("string key", "string val", redis.print);
redis.hset("hash key", "hashtest 1", "some value", redis.print);
redis.hset(["hash key", "hashtest 2", "some other value"], redis.print);
redis.hkeys("hash key", function (err, replies) {
  console.log(replies.length + " replies:");
  replies.forEach(function (reply, i) {
      console.log("    " + i + ": " + reply);
  });
  redis.quit();
});

//  Local cache for static content [fixed and loaded at startup]
var zcache = { 'index.html': '' };
zcache['index.html'] = fs.readFileSync('./index.html'); //  Cache index.html

// Create "express" server.
var app  = express.createServer();


/*  =====================================================================  */
/*  Setup route handlers.  */
/*  =====================================================================  */

// Handler for GET /health
app.get('/health', function(req, res){
    res.send('1');
});

// Handler for GET /asciimo
app.get('/asciimo', function(req, res){
    var link="https://a248.e.akamai.net/assets.github.com/img/d84f00f173afcf3bc81b4fad855e39838b23d8ff/687474703a2f2f696d6775722e636f6d2f6b6d626a422e706e67";
    res.send("<html><body><img src='" + link + "'></body></html>");
});

// Handler for GET /
app.get('/', function(req, res){
    res.send(zcache['index.html'], {'Content-Type': 'text/html'});
});


//  Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_DIY_IP;
var port    = process.env.OPENSHIFT_DIY_PORT || 8080;

if (typeof ipaddr === "undefined") {
   console.warn('No OPENSHIFT_INTERNAL_IP environment variable');
}

//  terminator === the termination handler.
function terminator(sig) {
   if (typeof sig === "string") {
      console.log('%s: Received %s - terminating Node server ...',
                  Date(Date.now()), sig);
      process.exit(1);
   }
   console.log('%s: Node server stopped.', Date(Date.now()) );
}

//  Process on exit and signals.
process.on('exit', function() { terminator(); });

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});

//  And start the app on that interface (and port).
app.listen(port, ipaddr, function() {
   console.log('%s: Node (version: %s) %s started on %s:%d ...', Date(Date.now() ), process.version, process.argv[1], ipaddr, port);
});
