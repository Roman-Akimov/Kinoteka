import axios from "axios";

const API_KEY = 'b164d762-f547-4ad6-b819-45f920a7e1c0';
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

async function fetchMovies({ page = 1, order = 'RATING', type = 'FILM', ratingFrom = 0, ratingTo = 10, yearFrom = 2000, yearTo = 2025, genre = null, country = null }) {
    try {
        const url = `${BASE_URL}/films`;

        const response = await axios.get(url, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
            params: {
                page,
                order,
                type,
                ratingFrom,
                ratingTo,
                yearFrom,
                yearTo,
                genres: genre,
                countries: country
            }
        });

        return response.data; // Возвращаем полученные данные
    } catch (error) {
        throw new Error(`Error fetching movies: ${error.message}`);
    }
}

// Функция для получения информации о фильме по ID
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/films/${movieId}`, {
            headers: {
                "X-API-KEY": API_KEY, // Подставь свой API-ключ
            },
        });

        return response.data; // Возвращаем данные о фильме
    } catch (error) {
        throw new Error(`Error fetching movie details: ${error.response ? error.response.data.message : error.message}`);
    }
};


export { fetchMovies };
