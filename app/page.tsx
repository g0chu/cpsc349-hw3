'use client';

import { useState, useEffect } from 'react';
import './styles.css';

const API_KEY = '4a5c03d54ab6163ac94f717c3bc58ed9';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const SORT_MAP: Record<string, string> = {
  date_desc: 'primary_release_date.desc',
  date_asc: 'primary_release_date.asc',
  rating_desc: 'vote_average.desc',
  rating_asc: 'vote_average.asc',
};

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    loadMovies(search);
  }, [page, sort, search]);

  async function loadMovies(currentSearch = search) {
    const q = currentSearch.trim();
    const url = q
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${SORT_MAP[sort] || 'popularity.desc'}${sort.startsWith('rating') ? '&vote_count.gte=100' : ''}&page=${page}`;

    const data = await fetch(url).then(r => r.json());
    let results: Movie[] = data.results || [];
    const total = data.total_pages || 1;

    if (q && sort) {
      if (sort === 'date_desc')   results.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      if (sort === 'date_asc')    results.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
      if (sort === 'rating_desc') results.sort((a, b) => b.vote_average - a.vote_average);
      if (sort === 'rating_asc')  results.sort((a, b) => a.vote_average - b.vote_average);
    }

    setMovies(results);
    setTotalPages(total);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
    setSort(e.target.value);
    setPage(1);
  }

  return (
    <>
      <h1>Movie Explorer</h1>

      <div id="controls">
        <input
          id="searchInput"
          placeholder="Search for a movie..."
          value={search}
          onChange={handleSearch}
        />
        <select id="sortSelect" value={sort} onChange={handleSort}>
          <option value="" disabled>Sort By</option>
          <option value="date_desc">Release Date (Newest)</option>
          <option value="date_asc">Release Date (Oldest)</option>
          <option value="rating_desc">Rating (Highest)</option>
          <option value="rating_asc">Rating (Lowest)</option>
        </select>
      </div>

      <div id="movieGrid">
        {movies.map(m => (
          <div className="movie-card" key={m.id}>
            <img
              src={m.poster_path ? IMG_BASE + m.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}
              alt={m.title}
            />
            <div className="info">
              <div className="title">{m.title}</div>
              <div className="meta">
                Release Date: {m.release_date || 'N/A'}<br />
                Rating: {m.vote_average != null ? m.vote_average.toFixed(3) : 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="pagination">
        <button id="prevBtn" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Previous</button>
        <span id="pageInfo">Page {page} / {totalPages}</span>
        <button id="nextBtn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next</button>
      </div>
    </>
  );
}