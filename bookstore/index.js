const express = require("express");
const connect = require("./db");
const store = require("./book.schema");
const check = require("./middleware");
const app = express();
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).send("welcome to the book store")
})
app.get("/books/book/:id", async (req, res) => {
    let data = await store.findById(req.params.id)
    if (!data) {
        res.status(404).send({ message: "book not found" })
    }
    res.status(200).send(data)
})
app.delete("/books/delete/:id", async (req, res) => {
    let { id } = req.params
    let data = await store.findByIdAndDelete(id)
    let allbooks = await store.find()
    res.status(200).send(data.allbooks)
})
app.get("/books", async (req, res) => {
    let data = await store.find()
    res.status(200).send(data)
})

app.post("/books/addbooks", check, async (req, res) => {
    let data = await store.create(req.body)
    res.send(data)
})
app.patch("/books/update/:id", async (req, res) => {
    let { id } = req.params
    let data = await store.findByIdAndUpdate(id, req.body)
    let books = await store.find()
    res.send(data.books)
})
app.get("/books/filter" , async (req,res) =>{
    const {author , category , title , price} = req.query;
    const filter = {}

    if(author){
        filter.author = author;
    }
    else if(title){
        filter.title = title;
    }
    else if(category){
        filter.category = category;
    }

    let data = await store.find(filter)
    res.send(data)
})

app.listen(8090, () => {
    connect()
    console.log("server on 8090")
})