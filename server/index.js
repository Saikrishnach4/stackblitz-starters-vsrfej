require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(
  'mongodb+srv://saikrishnachippa4:books@cluster0.rghmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const BookSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  description: String,
  thumbnail: String,
});

const Book = mongoose.model('Book', BookSchema);

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );
    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || 'No image available',
    }));
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.get('/api/favorites', async (req, res) => {
  const favorites = await Book.find();
  res.json(favorites);
});

app.post('/api/favorites', async (req, res) => {
  const { title, authors, description, thumbnail } = req.body;
  const newFavorite = new Book({ title, authors, description, thumbnail });
  await newFavorite.save();
  res.json(newFavorite);
});

app.delete('/api/favorites/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book removed from favorites' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
