import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
  },
  { timestamps: true }
);

bookingSchema.index({ vehicle_id: 1, start_date: 1, end_date: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
