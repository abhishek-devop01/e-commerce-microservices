const amqplib = require("amqplib");

let channel, connection;

async function connect() {
  if (connection) return connection;

  try {
    connection = await amqplib.connect(process.env.RABBIT_URL);
    console.log("connected to RabbitMQ");
    channel = await connection.createChannel();
  } catch (err) {
    console.log("Error in connecting RabbitMQ:", err);
  }
}

async function publishToQueue(queueName, data = {}) {
  if (!channel || !connection) await connect();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log('Message sent to queue: ', queueName, data);
  
}





module.exports = {
  connect,
  channel,
  connection,
  publishToQueue
};
