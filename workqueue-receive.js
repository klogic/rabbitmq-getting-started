#!/usr/bin/env node

require("dotenv").config();
var amqp = require("amqplib/callback_api");
amqp.connect("amqp://" + process.env.RABBITMQ_URL, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = "task_queue";
    ch.assertQueue(q, { durable: true });
    ch.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(
      q,
      msg => {
        var secs = msg.content.toString().split(".").length - 1;
        console.log(secs, "secs");
        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function() {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      { noAck: true }
    );
  });
});
