const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


if (!username || !password) {
  return res.status(400).json({ message: "Username or password not given" });
}

if (doesExist(username)) {
  return res.status(409).json({ message: "User already exists!" });
}

users.push({ "username": username, "password": password });
users.push({'username': req.body.username, 'password': req.body.password})
return res.status(200).json({ message: "User successfully registered. Now you can login" });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books)
  return res.status(200).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if(isbn){
    res.send(book)
    return res.status(200).json({message: `${book} retrieved`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author.split(' ')
    const filteredBooks = Object.values(books).filter((book)=> book.author.includes(author) )
    res.send(filteredBooks)
    

  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title.split(' ')
    const filteredBooks = Object.values(books).filter((book)=> book.title.includes(title) )
    res.send(filteredBooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if(isbn){
    res.send(book.reviews)
    return res.status(200).json({message: `${book.reviews} retrieved`});
  }
});

module.exports.general = public_users;
