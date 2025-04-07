import { ServiceProvider } from './serviceProvider.js'

const provider = new ServiceProvider()

// Register services here.

export const serviceProvider = Object.freeze(provider)
