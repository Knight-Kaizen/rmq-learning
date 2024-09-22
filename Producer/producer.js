const amqp = require('amqplib/callback_api');

// Create an AMQP connection to RabbitMQ (default port 5672)
amqp.connect('amqp://localhost:5672', (error0, connection) => {
    if (error0) {
        throw error0; // Handle connection error
    }

    // Create a channel
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1; // Handle channel error
        }

        const queue = 'hello'; // Queue name
        const msg = 'Hello world'; // Base message

        // Assert the queue (create if it doesn't exist)
        channel.assertQueue(queue, {
            durable: false // Messages won't persist across restarts
        });

        // Send multiple messages to the queue
        for (let i = 0; i < 5; i++) {
            const newMsg = msg + i; // Create a new message
            channel.sendToQueue(queue, Buffer.from(newMsg)); // Send message to the queue
        }

        console.log(" [x] Sent:", msg); // Log sent messages
    });

    // Close the connection after a short delay
    setTimeout(() => {
        console.log('Closing the connection');
        connection.close();
        process.exit(0); // Exit the process
    }, 500);
});