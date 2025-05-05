const API_KEY = 'b164d762-f547-4ad6-b819-45f920a7e1c0';
const BASE_URL = 'https://kinopoiskapiunofficial.tech/api/v2.2';

async function fetchMovies({ page = 1, order = 'RATING', type = 'FILM', ratingFrom = 0, ratingTo = 10, yearFrom = 2000, yearTo = 2025, genre = null, country = null }) {
    const url = new URL(`${BASE_URL}/films`);

    url.searchParams.append('page', page);
    url.searchParams.append('order', order);
    url.searchParams.append('type', type);
    url.searchParams.append('ratingFrom', ratingFrom);
    url.searchParams.append('ratingTo', ratingTo);
    url.searchParams.append('yearFrom', yearFrom);
    url.searchParams.append('yearTo', yearTo);

    if (genre) url.searchParams.append('genres', genre);
    if (country) url.searchParams.append('countries', country);

    const response = await fetch(url.toString(), {
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export { fetchMovies };
