import { Singleton } from './singleton.js'
import { Transient } from './transient.js'

/**
 * Represents a service provider (IoC Container)
 *
 * Based on the lecture @see {@link https://www.youtube.com/watch?v=HWVC6BfRr0U}
 *
 * And Microsofts Dependency Injection NuGet package @see {@link https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.serviceprovider?view=net-9.0-pp}
 */
export class ServiceProvider {
  #instances

  /**
   * Constructs a new Service Provider instance.
   */
  constructor () {
    this.#instances = new Map()
  }

  /**
   * Registers a singleton instance to the service provider.
   *
   * @param {string} name - The name, used to reference dependencies.
   * @param {Function} definition - The class constructor definition.
   * @param {string[]} dependencies - An array of dependency names.
   */
  registerSingleton (name, definition, dependencies = []) {
    this.#instances.set(name, new Singleton(definition, dependencies))
  }

  /**
   * Registers a transient instance to the service provider.
   *
   * @param {string} name - The name, used to reference dependencies.
   * @param {Function} definition - The class constructor definition.
   * @param {string[]} dependencies - An array of dependency names.
   */
  registerTransient (name, definition, dependencies = []) {
    this.#instances.set(name, new Transient(definition, dependencies))
  }

  /**
   * Retrieves a registered instance from the provided name.
   *
   * @param {string} name - The name of the instance to retrieve.
   * @returns {object} - The specified instance.
   */
  getInstance (name) {
    const instance = this.#instances.get(name)
    // Also pass scope.
    return instance.getInstance((delegateName) => this.getInstance(delegateName))
  }
}
