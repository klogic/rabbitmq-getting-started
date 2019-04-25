#!/usr/bin/env node

require("dotenv").config();
var amqp = require("amqplib/callback_api");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = "hello";

    ch.assertQueue(q, { durable: false });
    // Note: on Node 6 Buffer.from(msg) should be used
    ch.sendToQueue(q, new Buffer("Hello World!"));
    console.log(" [x] Sent 'Hello World!'");
    ch.sendToQueue(q, new Buffer(JSON.stringify(["Array", "Hello World!"])));
    console.log(` [x] Sent ["Array", "Hello World!"]`);
    ch.sendToQueue(
      q,
      new Buffer(
        JSON.stringify({ object0: "Hello World!", object2: "Hi World!" })
      )
    );
    console.log(`[x] Sent [{"object0":"Hello World!", "object2":"Hi World!"}]`);
    setTimeout(function() {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
