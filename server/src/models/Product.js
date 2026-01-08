import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    productLink: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Furniture',
        'Accessories', 
        'Arts',
        'Apps',
        'Agriculture',
        'Automative and Industrial',
        'Baby, Kids & Parenting',
        'Beauty, Personal Care & Wellness',
        'B2B, Industrial & Manufacturing',
        'D2C Brands & Consumer Products',
        'Fashion, Apparel & Accessories',
        'Entertainment',
        'Education, Learning & EdTech',
        'Electric Vehicles, Mobility & Transport',
        'Food, Beverage & FMCG',
        'Health, Fitness & Medical',
        'Home, Kitchen & Lifestyle',
        'Services & Marketplaces',
        'Sustainability & Green Products',
        'Sports & Outdoor',
        'Gift',
        'Tech & Electronics',
        'Miscellaneous',
        'Lighting',
        'Decor'
      ],
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'Please add a SKU'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
      },
    ],
    year: {
      type: Number,
      required: [true, 'Please add a year'],
      min: [1950, 'Year must be 1950 or later'],
      max: [new Date().getFullYear() + 10, 'Year cannot be too far in the future'],
    },
    month: {
      type: String,
      required: [true, 'Please add a month'],
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    status: {
      type: String,
      enum: ['Active', 'Hidden', 'Archived'],
      default: 'Active',
    },
    visibility: {
      published: {
        type: Boolean,
        default: false,
      },
      bestSelling: {
        type: Boolean,
        default: false,
      },
      editorsPick: {
        type: Boolean,
        default: false,
      },
      bestSellers: {
        type: Boolean,
        default: false,
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
productSchema.index({ year: -1, month: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
