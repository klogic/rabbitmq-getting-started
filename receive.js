#!/usr/bin/env node

require("dotenv").config();
var amqp = require("amqplib/callback_api");
amqp.connect("amqp://" + process.env.RABBITMQ_URL, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = "hello";

    ch.assertQueue(q, { durable: false });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(
      q,
      msg => {
        console.log(" [x] Received %s", msg.content.toString());
      },
      { noAck: true }
    );
  });
});
