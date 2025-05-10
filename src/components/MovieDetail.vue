<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchMovieDetails } from "@/api.js";

const route = useRoute();
const movieId = route.params.id;
const movie = ref(null);
const isLoading = ref(true);
const error = ref(null);

const loadMovieDetails = async () => {
  try {
    const data = await fetchMovieDetails(movieId);
    movie.value = data;
  } catch (err) {
    error.value = err.message;
    console.error("Error loading movie details:", err);
  } finally {
    isLoading.value = false;
  }
};

const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Не указан';
  return Number(rating).toFixed(1);
};

onMounted(loadMovieDetails);
</script>

<template>
  <div v-if="isLoading" class="loading">Загружается...</div>
  <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
  <div v-else class="movie-detail">
    <h1>{{ movie.nameRu || movie.nameEn || 'Без названия' }}</h1>
    <img v-if="movie.posterUrl" :src="movie.posterUrl" :alt="movie.nameRu || movie.nameEn" class="poster" />

    <p v-if="movie.description" class="description">{{ movie.description }}</p>

    <div class="details">
      <div v-if="movie.year"><strong>Год выпуска:</strong> {{ movie.year }}</div>

      <!-- Отображение рейтинга -->
      <div>
        <strong>Рейтинг:</strong>
        <span v-if="movie.ratingKinopoisk">
          Кинопоиск: {{ formatRating(movie.ratingKinopoisk) }}
        </span>
        <span v-if="movie.ratingImdb">
          <span v-if="movie.ratingKinopoisk">, </span>
          IMDb: {{ formatRating(movie.ratingImdb) }}
        </span>
        <span v-if="!movie.ratingKinopoisk && !movie.ratingImdb && movie.rating">
          {{ formatRating(movie.rating) }}
        </span>
        <span v-if="!movie.ratingKinopoisk && !movie.ratingImdb && !movie.rating">
          Не указан
        </span>
      </div>

      <div v-if="movie.genres?.length">
        <strong>Жанры:</strong>
        {{ movie.genres.map(genre => genre.name || genre.genre || 'Неизвестно').join(', ') }}
      </div>

      <div v-if="movie.countries?.length">
        <strong>Страны:</strong>
        {{ movie.countries.map(country => country.name || country.country || 'Неизвестно').join(', ') }}
      </div>

      <div v-if="movie.director"><strong>Режиссер:</strong> {{ movie.director }}</div>

      <div v-if="movie.actors?.length">
        <strong>Актеры:</strong>
        {{ movie.actors.join(', ') }}
      </div>
    </div>

    <div v-if="movie.trailers?.length" class="trailers">
      <h2>Трейлеры</h2>
      <div v-for="(trailer, index) in movie.trailers" :key="index">
        <iframe
            :src="trailer.url"
            width="560"
            height="315"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
      </div>
    </div>

    <div v-if="movie.reviews?.length" class="reviews">
      <h2>Рецензии</h2>
      <div v-for="(review, index) in movie.reviews" :key="index" class="review">
        <p v-if="review.author"><strong>{{ review.author }}:</strong></p>
        <p v-if="review.text">{{ review.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-detail {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #121212;
  color: #fff;
}

.poster {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 20px;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.details {
  font-size: 1rem;
  margin-bottom: 20px;
}

.details div {
  margin-bottom: 10px;
}

.trailers {
  margin-bottom: 30px;
}

.reviews {
  margin-top: 20px;
}

.review {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 5px;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 1.2rem;
}
</style>