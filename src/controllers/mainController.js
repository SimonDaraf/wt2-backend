export class MainController {
  #AVAILABLE_FIELDS = Object.freeze([
    'population',
    'gdp',
    'biofuel_cons_per_capita',
    'coal_cons_per_capita',
    'energy_per_capita',
    'fossil_energy_per_capita',
    'gas_energy_per_capita',
    'hydro_energy_per_capita',
    'low_carbon_energy_per_capita',
    'nuclear_energy_per_capita',
    'oil_energy_per_capita',
    'other_renewables_energy_per_capita',
    'renewables_energy_per_capita',
    'solar_energy_per_capita',
    'wind_energy_per_capita'
  ])

  async getAllCountries(req, res, next) {
    try {
      const [data] = await req.db.query('SELECT name FROM countries')
      return res.status(200).send(data)
    } catch (e) {
      console.error(e)
      const error = new Error
      error.status = 400
      next(error)
    }
  }

  /**
   * Gets stats related to lowest possible year etc.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware.
   */
  async getStats(req, res, next) {
    try {
      const [res_01] = await req.db.query('SELECT MIN(year) AS lowest_year FROM countries_data;')
      const [res_02] = await req.db.query('SELECT MAX(year) AS highest_year FROM countries_data;')
      const lowest_year = res_01['0'].lowest_year
      const highest_year = res_02['0'].highest_year

      res.status(200).send({ lowest_year, highest_year })
    } catch (e) {
      console.error(e)
      const error = new Error
      error.status = 400
      next(error)
    }    
  }

  /**
   * Gets all country data by year.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware.
   */
  async getByYear(req, res, next) {
    try {
      const year = req.year

      const fields = 'name, year, population, gdp, biofuel_cons_per_capita, coal_cons_per_capita, energy_per_capita, fossil_energy_per_capita, gas_energy_per_capita, hydro_energy_per_capita, low_carbon_energy_per_capita, nuclear_energy_per_capita, oil_energy_per_capita, other_renewables_energy_per_capita, renewables_energy_per_capita, solar_energy_per_capita, wind_energy_per_capita'
      const query = `SELECT ${fields} FROM countries_data cd LEFT JOIN countries c ON cd.country_id = c.id WHERE cd.year = ?;`

      const [entries] = await req.db.query(query, [year])

      res.status(200).send(entries)
    } catch (e) {
      console.error(e)
      const error = new Error
      error.status = 400
      next(error)
    }
  }

  /**
   * Gets specified field by year.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware.
   */
  async getByField(req, res, next) {
    try {
      const { year, field } = req

      const fields = `name, year, ${field}`
      const query = `SELECT ${fields} FROM countries_data cd LEFT JOIN countries c ON cd.country_id = c.id WHERE cd.year = ?;`

      const [entries] = await req.db.query(query, [year])

      res.status(200).send(entries)
    } catch(e) {
      console.error(e)
      const error = new Error()
      error.status = 400
      next(error)
    }
  }

  /**
   * Gets specified field by year and return top 10 results.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware.
   */
  async getByFieldTop(req, res, next) {
    try {
      const { year, field } = req

      const fields = `name, year, ${field}`
      const query = `SELECT ${fields} FROM countries_data cd LEFT JOIN countries c ON cd.country_id = c.id WHERE cd.year = ? ORDER BY ${field} DESC LIMIT 10;`

      const [entries] = await req.db.query(query, [year])

      res.status(200).send(entries)
    } catch(e) {
      console.error(e)
      const error = new Error()
      error.status = 400
      next(error)
    }
  }

  /**
   * Gets summary of field by year.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware.
   */
  async getSummary(req, res, next) {
    try {
      const { year, field } = req

      const query = `SELECT AVG(${field}) AS average, MIN(${field}) AS min, MAX(${field}) AS max FROM countries_data cd LEFT JOIN countries c ON cd.country_id = c.id WHERE cd.year = ?;`

      const [entries] = await req.db.query(query, [year])
      res.status(200).send(entries[0])
    } catch(e) {
      console.error(e)
      const error = new Error()
      error.status = 400
      next(error)
    }
  }

  async getAllByField(req, res, next) {
    try {
      const { field } = req
      const lowest_year = Number.parseInt(req.query.lowest_year)
      const highest_year = Number.parseInt(req.query.highest_year)

      const countries = JSON.parse(req.query.countries)

      if (!field || !lowest_year || !highest_year || !countries) throw new Error('Missing field/s')

      const resObject = { data: [], labels: [] }

      for (let i = lowest_year; i <= highest_year; i++) {
        resObject.labels.push(i)
      }

      // Assemble datapoints for each country
      for (const country of countries) {
        try {
          const query = `WITH RECURSIVE year_series AS (
                            SELECT ? AS year
                            UNION ALL
                            SELECT year + 1
                            FROM year_series
                            WHERE year < ?
                          ) 
                          SELECT ys.year, cd.${field} AS data_point 
                          FROM year_series ys 
                          LEFT JOIN countries_data cd 
                          ON cd.year = ys.year AND cd.country_id = (SELECT id FROM countries WHERE name = ?) 
                          ORDER BY ys.year;`
          const [qData] = await req.db.query(query, [lowest_year, highest_year, country])

          resObject.data.push({
            name: country,
            data: qData.map((d) => d.data_point),
          })
        } catch (e) {
          console.error(e)
          continue
        }
      }

      return res.status(200).send(resObject)
    } catch(e) {
      console.error(e)
      const error = new Error()
      error.status = 400
      next(error)
    }
  }

  /**
   * Verify that the year field is sort of valid.
   */
  isValidYear(req, res, next, year) {
    try {
      const numYear = Number.parseInt(year)

      if (!Number.isInteger(numYear)) {
        const error = new Error()
        error.status = 400
        next(error)
      }
  
      if (year < 0) {
        const error = new Error()
        error.status = 400
        next(error)
      }

      req.year = numYear
      next()
    } catch(e) {
      console.error(e)
      const error = new Error
      error.status = 400
      next(error)
    }
  }

  /**
   * Verify that the field is valid.
   */
  isValidField(req, res, next, field) {
    if (!this.#AVAILABLE_FIELDS.includes(field)) {
      const error = new Error()
      error.status = 400
      next(error)
    }

    req.field = field
    next()
  }
}