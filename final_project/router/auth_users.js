const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [

    {username: 'user', password: '1234'}
];

const JWT_SECRET='secret_key'

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password not provided" });
    }
  
    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid username or password" });
    }

    // Extend expiration time to make the user stay logged in for longer
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' }); // Expires in 7 days

    // Set token in cookie with a longer expiration time
    res.setHeader('Set-Cookie', `accessToken=${token}; Max-Age=${7 * 24 * 60 * 60}; HttpOnly`); // Max-Age in seconds

    return res.status(200).json({
        message: "Login successful",
        accessToken: token
    });
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.body.username
    const isbn = req.params.isbn
    const review = req.body.review 
  

  if (!username || !review) {
    return res.status(400).json({ message: "Username or review not provided" });
  }


  const bookIndex = books.findIndex(book => book.isbn === isbn);

  
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }


  const existingReviewIndex = books[bookIndex].reviews.findIndex(r => r.username === username);

  
  if (existingReviewIndex !== -1) {
    books[bookIndex].reviews[existingReviewIndex].review = review;
  } else {
    books[bookIndex].reviews.push({ username, review });
  }


  return res.status(200).json({ message: "Review added/modified successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
