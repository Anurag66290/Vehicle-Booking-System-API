import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
