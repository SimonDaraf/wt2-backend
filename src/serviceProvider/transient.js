/**
 * Represents a transient instance.
 */
export class Transient {
  #definition
  #dependencies

  /**
   * Constructs a transient instance.
   *
   * @param {Function} definition - The class constructor definition.
   * @param {string[]} dependencies - An array of dependencies.
   */
  constructor (definition, dependencies) {
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
    const args = this.#dependencies?.map((dependency) => resolverDelegate(dependency)) || []
    return new this.#definition(...args)
  }
}
