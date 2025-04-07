/**
 * Represents a singleton instance.
 */
export class Singleton {
  #instance
  #definition
  #dependencies

  /**
   * Constructs a singelton instance.
   *
   * @param {Function} definition - The class constructor definition.
   * @param {string[]} dependencies - An array of dependencies.
   */
  constructor (definition, dependencies) {
    this.#instance = null // Set to null before first instantiation.
    this.#definition = definition
    this.#dependencies = dependencies
  }

  /**
   * Retrieves the singleton instance.
   *
   * @param {Function} resolverDelegate - A method delegate to the dependency resolver.
   * @returns {object} - The instance.
   */
  getInstance (resolverDelegate) {
    if (this.#instance === null) {
      const args = this.#dependencies?.map((dependency) => resolverDelegate(dependency)) || []
      this.#instance = new this.#definition(...args) // construct instance.
      return this.#instance
    }

    return this.#instance
  }
}
