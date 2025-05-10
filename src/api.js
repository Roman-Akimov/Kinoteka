import axios from "axios";

const API_KEY = 'bd64e2f1-acf1-4b53-bfb3-c821974abdb3';
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

// Получение списка фильмов с фильтрами
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

// Получение списка жанров
export async function fetchGenres() {
    try {
        const response = await axios.get(`${BASE_URL}/films/filters`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        return response.data.genres;
    } catch (error) {
        throw new Error(`Error fetching genres: ${error.message}`);
    }
}

// Получение списка стран
export async function fetchCountries() {
    try {
        const response = await axios.get(`${BASE_URL}/films/filters`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        return response.data.countries;
    } catch (error) {
        throw new Error(`Error fetching countries: ${error.message}`);
    }
}

// Получение информации о съёмочной группе фильма
export async function fetchMovieStaff(movieId) {
    try {
        const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v1/staff`, {
            headers: {
                'X-API-KEY': API_KEY
            },
            params: {
                filmId: movieId
            }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching staff:", error);
        return [];
    }
}



// Получение рецензий к фильму
export async function fetchMovieReviews(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/films/${movieId}/reviews`, {
            headers: {
                'X-API-KEY': API_KEY
            },
            params: {
                page: 1
            }
        });
        return response.data.items; // список рецензий
    } catch (error) {
        throw new Error(`Error fetching reviews: ${error.message}`);
    }
}

export async function fetchMovieActors(movieId) {
    try {
        const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v1/staff`, {
            headers: {
                'X-API-KEY': API_KEY
            },
            params: {
                filmId: movieId
            }
        });

        // Фильтруем только актеров
        const actors = response.data.filter(person =>
            person.professionKey === 'ACTOR' ||
            person.profession?.toLowerCase().includes('actor') ||
            person.profession?.toLowerCase().includes('актер')
        );

        return actors;
    } catch (error) {
        console.error('Error fetching actors:', error);
        return [];
    }
}
export async function fetchMovieVideos(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/films/${movieId}/videos`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        // Обрабатываем разные типы видео
        return response.data.items.map(video => {
            // Для YouTube видео преобразуем URL в embed-формат
            if (video.site === 'YOUTUBE') {
                const videoId = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                return {
                    ...video,
                    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null
                };
            }

            // Для других источников оставляем как есть
            return {
                ...video,
                embedUrl: video.url
            };
        }).filter(video => video.embedUrl); // Фильтруем только видео с валидным URL

    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
}


// Получение кадров фильма
export async function fetchMovieFrames(movieId) {
    try {
        const response = await axios.get(`${BASE_URL}/films/${movieId}/frames`, {
            headers: {
                'X-API-KEY': API_KEY
            }
        });
        return response.data.items; // список кадров фильма
    } catch (error) {
        throw new Error(`Error fetching frames: ${error.message}`);
    }
}

// Генерация списка годов
export function generateYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 30}, (_, i) => currentYear - i);
}


export { fetchMovies };
