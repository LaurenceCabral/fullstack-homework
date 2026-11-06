const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.ObjectId, ref: 'Genre' }],
});

// Virtual for this book instance URL.
bookSchema.virtual('url').get(function getUrl() {
  return `/catalog/book/${this.id}`;
});

// Export model.
module.exports = mongoose.model('Book', bookSchema);
