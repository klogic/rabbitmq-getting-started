#!/usr/bin/env node

require("dotenv").config();
var amqp = require("amqplib/callback_api");

amqp.connect("amqp://" + process.env.RABBITMQ_URL, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "logs";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    ch.assertExchange(ex, "fanout", { durable: false });
    ch.publish(ex, "", new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
});
