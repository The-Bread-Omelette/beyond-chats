import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500
    },
    content: {
      type: String,
      trim: true
    },
    originalContent: {
      type: String,
      trim: true
    },
    publishedAt: Date,

    enhancementStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true
    },
    enhancedAt: Date,
    enhancementError: String,
    references: [{
      title: { type: String, required: true },
      url: { type: String, required: true }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ArticleSchema.index({ enhancementStatus: 1, createdAt: 1 });
ArticleSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Article', ArticleSchema);