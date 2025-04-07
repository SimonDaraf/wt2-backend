import mongoose from 'mongoose'
/**
 * Establishes a connection to a MongoDB database.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<mongoose.Mongoose>} Resolves to a Mongoose instance if connection succeeded.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  // Will cause errors instead of producing bad data.
  mongoose.set('strict', 'throw')

  // Turn on strict mode for query filters.
  mongoose.set('strictQuery', true)

  // Bind connection to events.
  connection.on('connected', () => console.log('Mongoose connected to MongoDB'))
  connection.on('error', (error) => console.error(`Mongoose connection error ${error}`))
  connection.on('disconnected', () => console.log('Mongoose disconnected from MongoDB'))

  // Close the connection if the process ends.
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close()
        console.log(`Mongoose disconnected from MongoDB through ${signalEvent}`)
        process.exit(0)
      })()
    })
  }

  console.log('MongoDB connection opened.')
  return mongoose.connect(connectionString)
}
