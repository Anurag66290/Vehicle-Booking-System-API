import express from 'express'
var router = express.Router();


/* Import Controllers. */
import {
  Seed,
  vehicle_type,
  get_vehicle,
  booking,
  get_bookings
} from '../controller/userController.js'


router.route("/seed").post(Seed)

router.route("/vehicletype").get(vehicle_type)

router.route("/getvehicle").get(get_vehicle)

router.route("/booking").post(booking)

router.route("/getvehicle").get(get_vehicle)


export default router
