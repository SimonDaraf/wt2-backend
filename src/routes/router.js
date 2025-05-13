/**
 * @file Router for the application.
 * @module src/routes/router
 * @author Simon Danielsson
 * @version 1.0.0
 */

import express from 'express'
import http from 'node:http'
import { MainController } from '../controllers/mainController.js'

export const router = express.Router()
const mainController = new MainController()

router.param('year', (req, res, next, year) => mainController.isValidYear(req, res, next, year))
router.param('field', (req, res, next, field) => mainController.isValidField(req, res, next, field))

router.get('/stats', (req, res, next) => mainController.getStats(req, res, next))
router.get('/countries', (req, res, next) => mainController.getAllCountries(req, res, next))

router.get('/:year(\\d{4})/:field/summary', (req, res, next) => mainController.getSummary(req, res, next))
router.get('/:year(\\d{4})/:field/top', (req, res, next) => mainController.getByFieldTop(req, res, next))
router.get('/:year(\\d{4})/:field', (req, res, next) => mainController.getByField(req, res, next))
router.get('/:year(\\d{4})', (req, res, next) => mainController.getByYear(req, res, next))

router.get('/:field', (req, res, next) => mainController.getAllByField(req, res, next))

// Catch 404
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})