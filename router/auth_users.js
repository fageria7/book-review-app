const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const regex = /^[a-zA-Z0-9]{3,}$/;
  return regex.test(username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const token = jwt.sign({ username }, 'secret_key'); // Replace 'secret_key' with an actual secret
  return res.status(200).json({ message: 'Login successful', token });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username; // Assuming `req.user` is set during authentication
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/updated' });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Assuming `req.user` is set during authentication
  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res
      .status(200)
      .json({ message: 'Review for the ISBN 2 posted by user Test deleted ' });
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
