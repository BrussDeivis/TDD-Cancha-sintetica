const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.Promise = Promise;

let mongoServer;

module.exports.getUri = async () => {
  if (process.env.NODE_ENV === 'test') {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create(); // Utiliza create() en lugar de new
    }
    return mongoServer.getUri();
  }

  return process.env.DB_URI;
};

module.exports.connect = async ({ uri }) => {
  await mongoose.connect(uri);

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${uri}`);
  });
};

module.exports.closeDb = async () => {
  await mongoose.disconnect();

  if (process.env.NODE_ENV === 'test' && mongoServer) {
    await mongoServer.stop();
  }
};
