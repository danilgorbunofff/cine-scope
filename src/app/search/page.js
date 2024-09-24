"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { useRouter } from "next/navigation";

import ArrowLeft from "../../../public/icons/left-arrow.svg";

export default function Home() {
  const [moviePosters, setMoviePosters] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState([]);
  const [year, setYear] = useState("all");
  const [searchType, setSearchType] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e = null) => {
    if (e) e.preventDefault();

    console.log("currentPage: " + currentPage);

    if (movieName.trim() !== "") {
      router.push(
        `/search?searchType=movie&query=${movieName}&year=${year}&page=${currentPage}`
      );
    }
  };

  const handleGenreSearch = (e = null, genre, page = 1) => {
    // if (e) e.preventDefault();

    console.log("currentPage: " + currentPage);

    router.push(`/search?genre=${genre}&year=${year}&page=${page}`);
  };

  // /search?type=${nowPlaying/popular/topRated/upcoming/genre/movieSearch}&year=${year}&query=${movieName}&page=${currentPage}

  /**
   * Movie search

    /search?query=${movieName}&year=${year}&page=${currentPage}
  */

  /**
   * Genre
   
    /search?genre=${genre}&year=${year}&page=${currentPage}
  */

  /**
   * Type
    
    /search?type=${searchType}&page=${currentPage}
  */

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Trigger the search after setting the currentPage
    if (movieName.trim() !== "") {
      handleSearch(); // Trigger search after page is set
    }
  };

  useEffect(() => {
    // Fetch popular movies on load
    async function fetchMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=982d100dd096eda979ca321f24939042`
      );
      const data = await response.json();
      const posters = data.results
        .slice(0, 12)
        .map((movie) => `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
      setMoviePosters(posters);
    }

    fetchMovies();

    async function fetchGenres() {
      const url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setGenres(data.genres);
        console.log(data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    }

    fetchGenres();
  }, []);

  // Search movies based on the query
  const searchMovie = async (query, page = 1) => {
    if (!query) return;

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const searchGenre = async (genre, page = 1) => {
    if (!genre) return;

    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${genre}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error("Error fetching search results:", err);
    }
  };

  const searchSection = (section, page) => {
    if (section == "nowPlaying") {
      searchNowPlaying(page);
    } else if (section == "popular") {
      searchPopular(page);
    } else if (section == "topRated") {
      searchTopRated(page);
    } else if (section == "upcoming") {
      searchUpcoming(page);
    } else {
      // Implement 404 page
    }
  };

  const searchNowPlaying = async (page = 1) => {
    const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
      console.log(data.results);
    } catch (err) {
      console.error("Error fetching now playing results:", err);
    }
  };

  const searchPopular = async (page = 1) => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
      console.log(data.results);
    } catch (err) {
      console.error("Error fetching popular results:", err);
    }
  };

  const searchTopRated = async (page = 1) => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
      console.log(data.results);
    } catch (err) {
      console.error("Error fetching top rated results:", err);
    }
  };

  const searchUpcoming = async (page = 1) => {
    const url =
      `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODJkMTAwZGQwOTZlZGE5NzljYTMyMWYyNDkzOTA0MiIsIm5iZiI6MTcyNTQ3ODAyNy4wOTc3MzMsInN1YiI6IjY2ZDhhYWJmMjg4NzFlZTQ0MDRmNGRhZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CvBuNMKtj2Blg2bUNYS3OEfoXk6x1S5SdigQ2RIdlsY",
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchedMovies(data.results);
      setTotalPages(data.total_pages);
      console.log(data.results);
    } catch (err) {
      console.error("Error fetching top rated results:", err);
    }
  };

  // Automatically search when there's a "query" in the URL
  useEffect(() => {
    let query = "",
      genre = "",
      section = "";

    let page = searchParams.get("page"); // Get "page" parameter from URL
    setCurrentPage(parseInt(page)); // Set the page as the search input value

    if (searchParams.get("query")) {
      query = searchParams.get("query"); // Get "query" parameter from URL
      setMovieName(query);
      searchMovie(query, currentPage); // Perform the search
    } else if (searchParams.get("genre")) {
      genre = searchParams.get("genre");
      setGenre(genre);
      searchGenre(genre, currentPage);
    } else if (searchParams.get("section")) {
      section = searchParams.get("section");
      searchSection(section, currentPage);
    } else {
      console.log("searchParams.get ERROR!!!");
    }

    // if (query) {
    // setMovieName(query); // Set the query as the search input value
    // console.log("currentPage - " + currentPage);
    // }
  }, [searchParams, currentPage]); // Re-run this effect when searchParams changes

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Set page is " + currentPage);

    router.push(`/search?query=${movieName}&page=${page}`);

    // handleSearch();

    // movieName !== "" ? searchMovie(movieName, page) : searchNowPlaying(page);

    // window.scrollTo({
    // top: 0,
    // behavior: "smooth", // Adds a smooth scrolling effect
    // });
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center py-10 items-stretch">
      <div className="fixed w-full h-full grid grid-cols-6 grid-rows-2 gap-4 p-2 z-10 top-0 left-0">
        {moviePosters.map((poster, index) => (
          <div
            key={index}
            className="w-full h-full z-10"
            style={{
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ))}
      </div>

      <div className="fixed inset-0 bg-black opacity-70 z-20"></div>

      <div className="w-[65%] min-h-full z-30 rounded-lg grid grid-cols-4">
        <div className="bg-red-400 rounded-l-lg p-3 flex flex-col gap-4">
          <div className="text-2xl px-4 py-2 rounded-lg text-white bg-red-600 font-semibold shadow-md text-center">
            Navigation
          </div>
          <div className=" text-red-600 grid grid-cols-2 grid-rows-2 gap-2 ">
            <div
              className="bg-white rounded-md py-1 px-2 shadow-md flex items-center justify-center text-center hover:text-white hover:bg-transparent hover:outline outline-1 outline-white cursor-pointer transition-all duration-100"
              onClick={() => {
                searchNowPlaying();
              }}
            >
              Playing
            </div>
            <div
              className="bg-white rounded-md py-1 px-2 shadow-md flex items-center justify-center text-center hover:text-white hover:bg-transparent hover:outline outline-1 outline-white cursor-pointer transition-all duration-100"
              onClick={() => {
                searchPopular();
              }}
            >
              Popular
            </div>
            <div
              className="bg-white rounded-md py-1 px-2 shadow-md flex items-center justify-center text-center hover:text-white hover:bg-transparent hover:outline outline-1 outline-white cursor-pointer transition-all duration-100"
              onClick={() => {
                searchTopRated();
              }}
            >
              Top Rated
            </div>
            <div
              className="bg-white rounded-md py-1 px-2 shadow-md flex items-center justify-center text-center hover:text-white hover:bg-transparent hover:outline outline-1 outline-white cursor-pointer transition-all duration-100"
              onClick={() => {
                searchUpcoming();
              }}
            >
              Upcoming
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className=" p-2 rounded-md text-white bg-red-600 text-center font-semibold shadow-md">
              By year:
            </div>
            <select
              id="year-select"
              className="rounded-md text-red-600 shadow-md p-2 cursor-pointer"
            >
              <option>All</option>
              {(() => {
                const options = [];
                for (let year = 2024; year >= 2015; year--) {
                  options.push(
                    <option
                      key={year}
                      className={`${year % 2 === 0 ? "bg-red-100" : "bg-white"}`}
                      value={year}
                    >
                      {year}
                    </option>
                  );
                }
                return options;
              })()}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-red-600 p-2 rounded-md text-white text-center font-semibold shadow-md">
              By genre:
            </div>
            <div className="flex flex-wrap gap-y-2 gap-x-2 justify-between">
              {genres.map((genre) => (
                <div
                  key={genre.id}
                  data-id={genre.id}
                  onClick={() => {
                    handleGenreSearch(null, genre.id);
                  }}
                  className="bg-white px-2 py-1 rounded-md text-red-600 flex-grow flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 text-center shadow-md hover:text-white hover:bg-transparent hover:outline outline-1 outline-white cursor-pointer transition-all duration-100"
                >
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="bg-red-600 rounded-tr-lg flex justify-between items-center p-3 shadow-md">
            <form className="flex" onSubmit={handleSearch}>
              <input
                type="text"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                placeholder="Search for movies..."
                className="text-gray-700 rounded-l-lg text-md px-3 py-1 w-70 focus:outline-none shadow-md"
              ></input>
              <button
                // onClick={() => searchMovie(movieName)} // Search when button is clicked
                className="py-2 px-3 bg-red-800 text-white rounded-r-lg shadow-md hover:text-red-800  border-l-2 border-red-800 hover:bg-white text-md font-semibold transition-all duration-300"
              >
                Search
              </button>
            </form>
            <h1 className="text-2xl px-4 py-2 rounded-lg text-red-600 bg-white font-semibold shadow-md">
              CineScope
            </h1>
          </div>
          <div className="p-4 pb-0 bg-white h-full grid grid-cols-4 gap-4">
            {searchedMovies?.map((movie, index) => (
              <div key={index} className="bg-red-100 rounded-md pb-1">
                {movie.poster_path ? (
                  <img
                    className="w-full h-72 object-cover z-10 p-1 rounded-lg"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.original_title}
                  />
                ) : (
                  <div className="w-full h-72 flex text-center items-center justify-center text-red-600 font-bold text-lg p-4">
                    404 Not Found
                  </div>
                )}
                <div className="flex justify-between gap-1 px-2 py-1">
                  <div className="text-black self-center">
                    {movie.original_title}
                  </div>
                  <div className="text-white text-sm rounded-md bg-red-500 py-1 px-2 mb-auto ">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-br-lg py-4 flex items-center justify-center">
            {/* Pagination Component */}
            <form
              className="flex items-center justify-center gap-2"
              onSubmit={handleSubmit}
            >
              {/* Left Arrow */}
              <div
                className={`w-7 h-7 p-1 cursor-pointer hover:bg-red-600 group transition-all duration-300 rounded-md flex items-center justify-center ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                    : ""
                }`}
                onClick={() => {
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1); // Change page
                  }
                }}
              >
                <ArrowLeft
                  className={`w-3/4 h-full text-red-600 group-hover:text-white transition-all duration-300 ${
                    currentPage == 1
                      ? "opacity-50 cursor-not-allowed group-hover:text-red-600"
                      : ""
                  }`}
                />
              </div>

              {/* Dynamic Page Numbers */}
              {(() => {
                const pageNumbers = [];

                // Always show the first page
                pageNumbers.push(
                  <button
                    type="submit"
                    key={1}
                    className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-red-600"
                        : "bg-red-400 hover:bg-transparent hover:text-red-600"
                    }`}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </button>
                );

                // If totalPages <= 5, show all pages
                if (totalPages <= 5) {
                  for (let i = 2; i <= totalPages; i++) {
                    pageNumbers.push(
                      <button
                        type="submit"
                        key={i}
                        className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          currentPage === i
                            ? "bg-red-600"
                            : "bg-red-400 hover:bg-transparent hover:text-red-600"
                        }`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                } else {
                  // If currentPage <= 4, show pages 1 2 3 4 5 ... lastPage
                  if (currentPage <= 4) {
                    for (let i = 2; i <= 5; i++) {
                      pageNumbers.push(
                        <button
                          type="submit"
                          key={i}
                          className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            currentPage === i
                              ? "bg-red-600"
                              : "bg-red-400 hover:bg-transparent hover:text-red-600"
                          }`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Show ellipsis and last page
                    if (totalPages > 5) {
                      pageNumbers.push(
                        <div key="dots-right" className="text-red-600">
                          ...
                        </div>
                      );
                      pageNumbers.push(
                        <button
                          type="submit"
                          key={totalPages}
                          className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            currentPage === totalPages
                              ? "bg-red-600"
                              : "bg-red-400 hover:bg-transparent hover:text-red-600"
                          }`}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                  } else {
                    // Show 1 ... previous, current, next ... lastPage
                    pageNumbers.push(
                      <div key="dots-left" className="text-red-600">
                        ...
                      </div>
                    );

                    // Show previous, current, and next page
                    for (
                      let i = currentPage - 1;
                      i <= Math.min(currentPage + 1, totalPages - 1);
                      i++
                    ) {
                      pageNumbers.push(
                        <button
                          type="submit"
                          key={i}
                          className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            currentPage === i
                              ? "bg-red-600"
                              : "bg-red-400 hover:bg-transparent hover:text-red-600"
                          }`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      );
                    }

                    // Show ellipsis and last page
                    if (currentPage + 1 < totalPages) {
                      pageNumbers.push(
                        <div key="dots-right" className="text-red-600">
                          ...
                        </div>
                      );
                      pageNumbers.push(
                        <button
                          type="submit"
                          key={totalPages}
                          className={`text-white text-sm rounded-md w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            currentPage === totalPages
                              ? "bg-red-600"
                              : "bg-red-400 hover:bg-transparent hover:text-red-600"
                          }`}
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      );
                    }
                  }
                }

                return pageNumbers;
              })()}

              {/* Right Arrow */}
              <div
                className={`w-7 h-7 p-1 cursor-pointer hover:bg-red-600 group transition-all duration-300 rounded-md flex items-center justify-center ${
                  currentPage == totalPages
                    ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                    : ""
                }`}
                onClick={() => {
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1); // Change page
                  }
                }}
              >
                <ArrowLeft
                  className={`w-3/4 h-full text-red-600 group-hover:text-white transition-all duration-300 rotate-180
                                      ${
                                        currentPage == totalPages
                                          ? "opacity-50 cursor-not-allowed group-hover:text-red-600"
                                          : ""
                                      }`}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
