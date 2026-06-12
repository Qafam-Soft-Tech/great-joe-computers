import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price in NGN is required'],
      min: 0,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['Laptops', 'Desktops', 'Accessories', 'Components'],
    },
    stockCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' }); // full‑text search
productSchema.index({ category: 1, price: 1 });
export default mongoose.model('Product', productSchema);