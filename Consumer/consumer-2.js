const amqp = require('amqplib/callback_api');

// Connect to RabbitMQ server
amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;

    connection.createChannel((error1, channel) => {
        if (error1) throw error1;

        const queue = 'hello';

        // Assert the queue
        channel.assertQueue(queue, { durable: false });

        // Set prefetch to 1 to limit messages sent to this consumer
        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        // Consume messages from the queue
        channel.consume(queue, (msg) => {
            const task = msg.content.toString();
            console.log(" [x] Received '%s'", task);

            // Simulate a heavy task (5 seconds)
            setTimeout(() => {
                console.log(" [x] Done processing '%s'", task);
                // Acknowledge message processing
                channel.ack(msg);
            }, 5000);
        }, {
            noAck: false // Require acknowledgment after processing
        });
    });
});