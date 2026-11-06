const mongoose = require('mongoose');
const { DateTime } = require('luxon'); // for date handling

const { Schema } = mongoose;

const authorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author "full" name.
authorSchema.virtual('name').get(function getName() {
  return `${this.family_name}, ${this.first_name}`;
});

// Virtual for this author instance URL.
authorSchema.virtual('url').get(function getUrl() {
  return `/catalog/author/${this.id}`;
});

authorSchema.virtual('lifespan').get(function getLifespan() {
  let lifetimeString = '';
  if (this.date_of_birth) {
    lifetimeString = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
  }
  lifetimeString += ' - ';
  if (this.date_of_death) {
    lifetimeString += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
  }
  return lifetimeString;
});

authorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function getDateOfBirthYyyyMmDd() {
  return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
});

authorSchema.virtual('date_of_death_yyyy_mm_dd').get(function getDateOfDeathYyyyMmDd() {
  return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
});

// Export model.
module.exports = mongoose.model('Author', authorSchema);
