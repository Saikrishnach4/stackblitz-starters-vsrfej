import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const searchBooks = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/search?query=${query}`
    );
    setBooks(response.data);
  };

  const fetchFavorites = async () => {
    const response = await axios.get('http://localhost:5000/api/favorites');
    setFavorites(response.data);
  };

  const addToFavorites = async (book) => {
    await axios.post('http://localhost:5000/api/favorites', book);
    fetchFavorites();
  };

  const removeFromFavorites = async (id) => {
    await axios.delete(`http://localhost:5000/api/favorites/${id}`);
    fetchFavorites();
  };

  return (
    <div>
      <h1>Book Finder</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books"
      />
      <button onClick={searchBooks}>Search</button>

      <h2>Search Results</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h3>{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
            <img src={book.thumbnail} alt={book.title} />
            <p>{book.description}</p>
            <button onClick={() => addToFavorites(book)}>
              Add to Favorites
            </button>
          </li>
        ))}
      </ul>

      <h2>Favorites</h2>
      <ul>
        {favorites.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
            <img src={book.thumbnail} alt={book.title} />
            <p>{book.description}</p>
            <button onClick={() => removeFromFavorites(book._id)}>
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
