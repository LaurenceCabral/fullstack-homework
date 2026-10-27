const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: false }));

// http://localhost:5001/form should return a form with input elements for username, email, and submit button
app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, '04-form.html'));
});

// http://localhost:5001/submit should return all the data the user entered
// Plain text displays submitted values without interpreting them as HTML.
app.post('/submit', (req, res) => {
  const {
    username = '',
    email = '',
    comments = '',
    newsletter,
  } = req.body;

  res.status(200).type('text').send([
    `Username: ${username}`,
    `Email: ${email}`,
    `Comments: ${comments}`,
    `Newsletter: ${newsletter === 'yes' ? 'Yes' : 'No'}`,
  ].join('\n'));
});

app.listen(port, () => {
  console.log(`Form available at http://localhost:${port}/form`);
});
