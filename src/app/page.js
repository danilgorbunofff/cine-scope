"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [moviePosters, setMoviePosters] = useState([]);
  const [query, setQuery] = useState('');
  const [year, setYear] = useState(2024);
  const router = useRouter();

  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=982d100dd096eda979ca321f24939042`
      );
      const data = await response.json();
      const posters = data.results.slice(0, 12).map(
        (movie) => `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      );
      setMoviePosters(posters);
    }
    fetchMovies();
    const d = new Date();
    let currentYear = d.getFullYear();
    setYear(currentYear);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      router.push(`/search?searchType=movie&query=${query}&year=${year}&page=1`);
    }
  }

  return (
    <main className='min-h-screen relative'>
      <div className='absolute w-full h-full grid grid-cols-6 grid-rows-2 gap-4 p-4 z-10'>
        {moviePosters.map((poster, index) => (
            <div
              key={index}
              className="w-full h-full z-10"
              style={{
                backgroundImage: `url(${poster})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          ))}
      </div>
      
      <div className='absolute inset-0 bg-black opacity-70 z-20'></div>

      <div className='absolute w-screen h-screen gap-5 flex-col flex items-center justify-center z-30'>
        <h1 className="text-6xl font-semibold">Welcome to <span className='bg-red-600 px-3 py-1 rounded-lg'>CineScope</span></h1>
        <h2 className="text-xl">Discover movies tailored to your preferences</h2>
        <form className='flex' onSubmit={handleSearch}>
          <input type='text' placeholder='Search for movies...' className='text-gray-700 rounded-l-lg text-xl px-3 py-2 w-80 focus:outline-none' value={query} onChange={(e) => setQuery(e.target.value)}></input>
          <button type='submit' className='text-white py-2 px-3 bg-red-600 rounded-r-lg hover:bg-red-800 text-xl font-semibold transition-all duration-300'>Search</button>
        </form>
      </div>
    </main>
  );
}