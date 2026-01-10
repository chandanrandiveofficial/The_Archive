import mongoose from 'mongoose';

const morePageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    order: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
morePageSchema.pre('save', function (next) {
  try {
    if (this.isModified('title') && !this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    next();
  } catch (err) {
    console.error('Error in MorePage pre-save hook:', err);
    next(err);
  }
});

const MorePage = mongoose.model('MorePage', morePageSchema);

export default MorePage;
