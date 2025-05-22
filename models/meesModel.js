import mongoose from 'mongoose';

const messSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      unique: true
    },
    meals: {
      breakfast: {
        item: {
          type: String,
          required: [true, 'Breakfast item is required']
        },
        time: {
          type: String,
          required: [true, 'Breakfast time is required']
        }
      },
      lunch: {
        item: {
          type: String,
          required: [true, 'Lunch item is required']
        },
        time: {
          type: String,
          required: [true, 'Lunch time is required']
        }
      },
      dinner: {
        item: {
          type: String,
          required: [true, 'Dinner item is required']
        },
        time: {
          type: String,
          required: [true, 'Dinner time is required']
        }
      }
    }
  },
  {
    timestamps: true
  }
);

const Mess = mongoose.model('Mess', messSchema);

export default Mess;