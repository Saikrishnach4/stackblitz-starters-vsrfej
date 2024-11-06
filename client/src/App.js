import React, { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(""); // Reset error on each search
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${query}`
      );
      setBooks(response.data.docs);
    } catch (error) {
      setError("Error fetching data from Open Library API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Book Finder</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a book..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Loading Spinner */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="book-list">
          {books.length > 0 ? (
            books.map((book) => {
              const { title, author_name, publish_year, publisher, isbn, cover_i } = book;
              const coverUrl = cover_i
                ? `https://covers.openlibrary.org/b/id/${cover_i}-L.jpg`
                : "https://via.placeholder.com/150";

              return (
                <div className="book-card" key={book.key}>
                  <img src={coverUrl} alt={title} />
                  <div className="book-info">
                    <h3>{title}</h3>
                    <p><strong>Author:</strong> {author_name ? author_name.join(", ") : "Unknown Author"}</p>
                    <p><strong>Published:</strong> {publish_year ? publish_year.join(", ") : "N/A"}</p>
                    <p><strong>Publisher:</strong> {publisher ? publisher.join(", ") : "Unknown Publisher"}</p>
                    <p><strong>ISBN:</strong> {isbn ? isbn.join(", ") : "N/A"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
