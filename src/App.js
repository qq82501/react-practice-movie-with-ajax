import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMovieHandler = async function (movie) {
    const response = await fetch(
      "https://react-starwar-post-default-rtdb.firebaseio.com/movie.json",
      {
        method: "POST",
        headers: { "context-Type": "application/json" },
        body: JSON.stringify(movie),
      }
    );
    const data = await response.json();
    console.log(data);
  };
  const fetchMoviesHandler = useCallback(async function () {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-starwar-post-default-rtdb.firebaseio.com/movie.json"
      );
      if (!response.ok) throw new Error("something went wrong");

      const data = await response.json();
      console.log(data);

      let transformData = [];
      for (const key in data) {
        const movie = {
          id: key,
          title: data[key].title,
          releaseDate: data[key].releaseDate,
          openingText: data[key].openingText,
        };
        transformData.push(movie);
      }

      setMovies(transformData);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>No movie found</p>;
  if (isLoading) content = <p>Loading...</p>;
  if (movies.length) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
