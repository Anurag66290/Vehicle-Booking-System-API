import Booking from '../model/Booking.js';
import Vehicle from '../model/Vehicle.js';


/*
|----------------------------------------------------------------------------------------------------------------
|   Seed 
|----------------------------------------------------------------------------------------------------------------
*/
export const Seed = async (req, res) => {
  
    const data = {
        cars: [
          {
            type: 'hatchback',
            vehicles: [
              { make: 'Honda', model: 'Fit', type: 'hatchback' },
              { make: 'Toyota', model: 'Yaris', type: 'hatchback' }
            ]
          },
          {
            type: 'suv',
            vehicles: [
              { make: 'Ford', model: 'Explorer', type: 'suv' },
              { make: 'Chevrolet', model: 'Equinox', type: 'suv' }
            ]
          },
          {
            type: 'sedan',
            vehicles: [
              { make: 'Nissan', model: 'Altima', type: 'sedan' },
              { make: 'Honda', model: 'Accord', type: 'sedan' }
            ]
          }
        ],
        bikes: [
          {
            type: 'cruiser',
            vehicles: [
              { make: 'Harley Davidson', model: 'Softail', type: 'cruiser' }
            ]
          }
        ]
      };
        try {
        // Remove all existing vehicles from the database
        await Vehicle.deleteMany({});
    
        // Insert the new vehicles into the database
        for (const category of Object.keys(data)) {
          for (const item of data[category]) {
            for (const vehicle of item.vehicles) {
              const newVehicle = new Vehicle(vehicle);
              await newVehicle.save();
            }
          }
        }
    
        console.log('Data successfully seeded');
        process.exit();
      } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
      }
   
    }



/*
|----------------------------------------------------------------------------------------------------------------
|  get vehicle_type 
|----------------------------------------------------------------------------------------------------------------
*/
  export const vehicle_type = async(req, res)=>{
        try {
            const vehicleTypes = await Vehicle.find().distinct('type');
            res.json(vehicleTypes);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
          }
        
    }

/*
|----------------------------------------------------------------------------------------------------------------
| vehicles?vehicle_type=hatchback 
|----------------------------------------------------------------------------------------------------------------
*/
export const get_vehicle = async(req,res)=>{
    const { vehicle_type } = req.query;
    try {
      const vehicles = await Vehicle.find({ type: vehicle_type });
      res.status(200).json({ vehicles });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while retrieving the vehicles' });
    }

}


/*
|----------------------------------------------------------------------------------------------------------------
| booking
|----------------------------------------------------------------------------------------------------------------
*/
export const booking = async (req,res)=>{
    try {
        const { vehicleId, startDate, endDate, userId } = req.body;
    
        // Check if the vehicle is available for the given dates
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
          return res.status(404).json({ message: 'Vehicle not found' });
        }
        if (vehicle.isBooked) {
          return res.status(400).json({ message: 'Vehicle is already booked' });
        }
        const existingBooking = await Booking.findOne({
          vehicle: vehicleId,
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        });
        if (existingBooking) {
          return res.status(400).json({ message: 'Vehicle is not available for the given dates' });
        }
    
        // Create a new booking
        const booking = new Booking({
          vehicle: vehicleId,
          startDate,
          endDate,
          user: userId,
        });
        await booking.save();
    
        // Mark the vehicle as booked
        vehicle.isBooked = true;
        await vehicle.save();
    
        res.status(201).json({ message: 'Booking created successfully', booking });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the booking' });
      }
    }

      
/*
|----------------------------------------------------------------------------------------------------------------
| availability
|----------------------------------------------------------------------------------------------------------------
*/
export const availability= async (req, res) => {
        
            const { vehicle_type, start_date, end_date } = req.query;

            try {
              // Find vehicles of the given type that are not already booked for the given dates
              const vehicles = await Vehicle.find({
                type: vehicle_type,
                isBooked: false,
                _id: { $not: { $in: await Booking.distinct('vehicle_id', { start_date: { $lt: end_date }, end_date: { $gt: start_date } }) } }
              });
          
              res.json({ success: true, vehicles });
            } catch (error) {
              console.error(error);
              res.status(500).json({ success: false, message: 'Server Error' });
            }
        }
    


/*
|----------------------------------------------------------------------------------------------------------------
| get_bookings
|----------------------------------------------------------------------------------------------------------------
*/
export const get_bookings = async(req,res)=>{
    try {
        
            const { user_id } = req.query;
        
            const bookings = await Booking.find({ user_id });
        
            return res.status(200).json(bookings);
          } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'An error occurred while creating the booking' });
          }
}