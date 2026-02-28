import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import { handleFetch } from "../../services/movieService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);
      const fetchedMovies = await handleFetch(query);
      if (fetchedMovies.length === 0) {
        toast.error("No movies found for your request.")
      }
      setMovies(fetchedMovies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie | null) => {
    setSelected(movie)
  }

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={handleSelect} movies={movies} />}
      {selected && <MovieModal movie={selected} onClose={() => {handleSelect(null)}}/>}
      <Toaster position="top-center" />
    </>
  );
}

export default App;
