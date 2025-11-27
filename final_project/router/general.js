const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**********************************************
 * USER REGISTRATION
 **********************************************/
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    users.push({ username: username, password: password });
  
    return res.status(200).json({ message: "User registered successfully" });
});


/**********************************************
 * TASK 1 – Get all books
 **********************************************/
public_users.get('/', function (req, res) {
    return res.status(200).json({ message: "All books fetched", data: books });
});


/**********************************************
 * TASK 2 – Get book by ISBN
 **********************************************/
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) return res.status(404).json({ message: "Book not found" });

    return res.status(200).json({ message: "Book fetched", data: book });
});


/**********************************************
 * TASK 3 – Get books by author
 **********************************************/
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);

    let filteredBooks = [];

    keys.forEach((key) => {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    });

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json({ message: "Books by author fetched", data: filteredBooks });
});


/**********************************************
 * TASK 4 – Get books by title
 **********************************************/
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const keys = Object.keys(books);

    let filteredBooks = [];

    keys.forEach((key) => {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    });

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "No books found with this title" });
    }

    return res.status(200).json({ message: "Books by title fetched", data: filteredBooks });
});


/**********************************************
 * TASK 5 – Get reviews by ISBN
 **********************************************/
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Reviews fetched", reviews: book.reviews });
});


/**********************************************
 * TASK 10 – Promises / async-get-all-books
 **********************************************/
function getBooksPromise() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get("/async/books", async (req, res) => {
    try {
        const allBooks = await getBooksPromise();
        return res.status(200).json({
            message: "Books fetched using async/await",
            data: allBooks
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});


/**********************************************
 * TASK 11 – Promises / async-get-book-by-ISBN
 **********************************************/
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    });
}

public_users.get("/async/isbn/:isbn", async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        return res.status(200).json({
            message: "Book fetched using async/await",
            data: book
        });
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});


/**********************************************
 * TASK 12 – Promises / async-get-books-by-author
 **********************************************/
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        let result = [];

        keys.forEach(key => {
            if (books[key].author === author) {
                result.push(books[key]);
            }
        });

        resolve(result);
    });
}

public_users.get("/async/author/:author", async (req, res) => {
    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);

        if (booksByAuthor.length === 0)
            return res.status(404).json({ message: "No books found for this author" });

        return res.status(200).json({
            message: "Books fetched using async/await",
            data: booksByAuthor
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});


/**********************************************
 * TASK 13 – Promises / async-get-books-by-title
 **********************************************/
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        let result = [];

        keys.forEach(key => {
            if (books[key].title === title) {
                result.push(books[key]);
            }
        });

        resolve(result);
    });
}

public_users.get("/async/title/:title", async (req, res) => {
    try {
        const booksByTitle = await getBooksByTitle(req.params.title);

        if (booksByTitle.length === 0)
            return res.status(404).json({ message: "No books found with this title" });

        return res.status(200).json({
            message: "Books fetched using async/await",
            data: booksByTitle
        });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});


module.exports.general = public_users;
