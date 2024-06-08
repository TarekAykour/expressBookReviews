const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const authUsers = require("./auth_users.js");
const public_users = express.Router();
const isValid = authUsers.isValid;
const users = authUsers.users;

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const doesExist = (username) => {
        let userswithsamename = users.filter((user) => {
            return user.username === username;
        });
        return userswithsamename.length > 0;
    };

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password not given" });
    }

    if (doesExist(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Function to get the list of books available in the shop using async-await with Axios
async function getBooks() {
    try {
        const response = await axios.get('https://tarekaykour-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai//customer');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error; // Rethrow the error for handling in the route handlers
    }
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBooks();
        res.json(bookList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch book list' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.json(book);
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    res.json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.json(book.reviews);
});

module.exports.general = public_users;
