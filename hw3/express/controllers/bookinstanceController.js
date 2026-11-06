const { body, validationResult } = require('express-validator');
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

// Display list of all BookInstances.
exports.bookinstanceList = async (req, res) => {
  const allBookInstances = await BookInstance.find().populate('book').exec();

  res.render('bookinstance_list', {
    title: 'Book Instance List',
    bookinstance_list: allBookInstances,
  });
};

// Display detail page for a specific BookInstance.
exports.bookinstanceDetail = async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id).populate('book').exec();

  if (bookInstance === null) {
    // No results.
    const err = new Error('Book copy not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('bookinstance_detail', {
    title: 'Book:',
    bookinstance: bookInstance,
  });
};

// Display BookInstance create form on GET.
exports.bookinstanceCreateGet = async (req, res) => {
  const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

  res.render('bookinstance_form', {
    title: 'Create BookInstance',
    book_list: allBooks,
  });
};

// Handle BookInstance create on POST.
exports.bookinstanceCreatePost = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status', 'Choose a valid status').isIn(['Available', 'Maintenance', 'Loaned', 'Reserved']),
  body('due_back', 'Invalid date').optional({ values: 'falsy' }).isISO8601().toDate(),

  // Process request after validation and sanitization.
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allBooks = await Book.find({}, 'title').sort({ title: 1 }).exec();

      res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: allBooks,
        selected_book: bookInstance.book ? bookInstance.book.toString() : '',
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    }

    // Data from form is valid
    await bookInstance.save();
    res.redirect(bookInstance.url);
  },
];

// Display BookInstance delete form on GET.
exports.bookinstanceDeleteGet = async (req, res) => {
  const bookInstance = await BookInstance.findById(req.params.id).populate('book').exec();

  if (bookInstance === null) {
    // No results.
    res.redirect('/catalog/bookinstances');
    return;
  }

  res.render('bookinstance_delete', {
    title: 'Delete BookInstance',
    bookinstance: bookInstance,
  });
};

// Handle BookInstance delete on POST.
exports.bookinstanceDeletePost = async (req, res) => {
  // Assume valid BookInstance id in field.
  await BookInstance.findByIdAndDelete(req.params.id);
  res.redirect('/catalog/bookinstances');
};

// Display BookInstance update form on GET.
exports.bookinstanceUpdateGet = async (req, res, next) => {
  // Get book, all books for form (in parallel)
  const [bookInstance, allBooks] = await Promise.all([
    BookInstance.findById(req.params.id).populate('book').exec(),
    Book.find(),
  ]);

  if (bookInstance === null) {
    // No results.
    const err = new Error('Book copy not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('bookinstance_form', {
    title: 'Update BookInstance',
    book_list: allBooks,
    selected_book: bookInstance.book ? bookInstance.book.id : '',
    bookinstance: bookInstance,
  });
};

// Handle BookInstance update on POST.
exports.bookinstanceUpdatePost = [
  // Validate and sanitize fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
  body('status', 'Choose a valid status').isIn(['Available', 'Maintenance', 'Loaned', 'Reserved']),
  body('due_back', 'Invalid date').optional({ values: 'falsy' }).isISO8601().toDate(),

  // Process request after validation and sanitization.
  async (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped/trimmed data and current id.
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render the form again, passing sanitized values and errors.

      const allBooks = await Book.find({}, 'title').exec();

      res.render('bookinstance_form', {
        title: 'Update BookInstance',
        book_list: allBooks,
        selected_book: bookInstance.book ? bookInstance.book.toString() : '',
        errors: errors.array(),
        bookinstance: bookInstance,
      });
      return;
    }

    // Data from form is valid.
    await BookInstance.findByIdAndUpdate(req.params.id, bookInstance, {});
    // Redirect to detail page.
    res.redirect(bookInstance.url);
  },
];
