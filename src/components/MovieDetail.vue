<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  fetchMovieDetails,
  fetchMovieVideos,
  fetchMovieReviews,
  fetchMovieStaff,
  fetchMovieActors,
  fetchMovieFrames
} from "@/api.js";

const actors = ref([]);
const route = useRoute();
const movieId = Number(route.params.id); //  Приведение к числу
const movie = ref(null);
const isLoading = ref(true);
const error = ref(null);
const activeTab = ref('description'); // Для табов
const frames = ref([]); // Для кадров из фильма
const trailers = ref([]); // Для трейлеров
const reviews = ref([]); // Для рецензий
const staff = ref({}); // Для создателей

const loadMovieDetails = async () => {
  try {
    reviews.value = (await fetchMovieReviews(movieId)).filter(r => r.reviewText && r.reviewText.trim().length > 0);

    const data = await fetchMovieDetails(movieId);
    movie.value = data;

    // Загрузка трейлеров
    trailers.value = await fetchMovieVideos(movieId);

    // Загрузка актерского состава
    actors.value = await fetchMovieActors(movieId);

    // Загрузка рецензий
    reviews.value = await fetchMovieReviews(movieId);

    // Загрузка создателей (съёмочная группа)
    const staffList = await fetchMovieStaff(movieId);
    // Группируем съёмочную команду по профессиям
    const rawStaff = await fetchMovieStaff(movieId);
    if (!Array.isArray(rawStaff)) {
      console.error("Staff data is not an array");
      staff.value = { director: "Ошибка", producers: [] };
      return;
    }

    const director = rawStaff.find(p => p.professionKey === "DIRECTOR");
    const producers = rawStaff.filter(p => p.professionKey === "PRODUCER");

    staff.value = {
      director: director?.nameRu || director?.nameEn || "Неизвестно",
      producers: producers.map(p => p.nameRu || p.nameEn).filter(Boolean)
    };


    staff.value = {
      director: staffList
          .filter(p => p.professionKey === 'DIRECTOR')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal)
          .join(', '),
      producers: staffList
          .filter(p => p.professionKey === 'PRODUCER')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal),
      writers: staffList
          .filter(p => p.professionKey === 'WRITER')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal),
      composers: staffList
          .filter(p => p.professionKey === 'COMPOSER')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal),
      operators: staffList
          .filter(p => p.professionKey === 'OPERATOR')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal),
      editors: staffList
          .filter(p => p.professionKey === 'EDITOR')
          .map(p => p.nameRu || p.nameEn || p.nameOriginal),
    };
    if (data.filmId) {
      frames.value = await fetchMovieFrames(data.filmId);
    }
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

const formatActors = (actors) => {
  if (!actors) return [];
  return actors.map(actor => actor.name || actor.nameRu || actor.nameEn).filter(Boolean);
};

onMounted(loadMovieDetails);
</script>

<template>
  <div v-if="isLoading" class="loading">Загружается...</div>
  <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
  <div v-else class="movie-detail">
    <!-- Заголовок и постер -->
    <div class="movie-header">
      <img v-if="movie.posterUrl" :src="movie.posterUrl" :alt="movie.nameRu || movie.nameEn" class="poster"/>
      <div class="movie-header-info">
        <h1>{{ movie.nameRu || movie.nameEn || movie.nameOriginal || 'Без названия' }}</h1>
        <div v-if="movie.year || movie.filmLength" class="movie-meta">
          <span v-if="movie.year">{{ movie.year }}</span>
          <span v-if="movie.filmLength"> • {{ movie.filmLength }} мин.</span>
          <span v-if="movie.ageRating"> • {{ movie.ageRating }}+</span>
        </div>
        <div class="rating-badge" v-if="movie.ratingKinopoisk || movie.ratingImdb">
          <span v-if="movie.ratingKinopoisk" class="kp-rating">
            КП: {{ formatRating(movie.ratingKinopoisk) }}
          </span>
          <span v-if="movie.ratingImdb" class="imdb-rating">
            IMDb: {{ formatRating(movie.ratingImdb) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Навигационные табы -->
    <div class="tabs">
      <button
          @click="activeTab = 'description'"
          :class="{ active: activeTab === 'description' }"
      >
        Описание
      </button>
      <button
          @click="activeTab = 'crew'"
          :class="{ active: activeTab === 'crew' }"
      >
        Создатели
      </button>
      <button
          @click="activeTab = 'media'"
          :class="{ active: activeTab === 'media' }"
      >
        Медиа
      </button>
      <button
          @click="activeTab = 'reviews'"
          :class="{ active: activeTab === 'reviews' }"
      >
        Рецензии
      </button>
    </div>

    <!-- Контент табов -->
    <div class="tab-content">
      <!-- Описание фильма -->
      <div v-show="activeTab === 'description'" class="description-section">
        <div class="description-block">
          <h2>Описание</h2>
          <p v-if="movie.description">{{ movie.description }}</p>
          <p v-else>Описание отсутствует</p>
        </div>

        <div class="details-block">
          <h2>Детали</h2>
          <div class="details-grid">
            <div v-if="movie.genres?.length" class="detail-item">
              <strong>Жанры:</strong>
              <div class="genres-list">
                <span v-for="genre in movie.genres" :key="genre.id || genre.genre" class="genre-tag">
                  {{ genre.genre || genre.name }}
                </span>
              </div>
            </div>

            <div v-if="movie.countries?.length" class="detail-item">
              <strong>Страны:</strong>
              <div class="countries-list">
                <span v-for="country in movie.countries" :key="country.id || country.country" class="country-tag">
                  {{ country.country || country.name }}
                </span>
              </div>
            </div>

            <div v-if="movie.year" class="detail-item">
              <strong>Год выпуска:</strong>
              <span>{{ movie.year }}</span>
            </div>

            <div v-if="movie.premiereRu" class="detail-item">
              <strong>Премьера в РФ:</strong>
              <span>{{ movie.premiereRu }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Создатели -->
      <div v-show="activeTab === 'crew'" class="crew-section">
        <div class="crew-grid">
          <!-- Существующие создатели... -->
          <div v-if="staff.director" class="crew-item">
            <h3>Режиссёр</h3>
            <p>{{ staff.director }}</p>
          </div>

          <div v-if="staff.producers?.length" class="crew-item">
            <h3>Продюсеры</h3>
            <p>{{ staff.producers.join(', ') }}</p>
          </div>

          <div v-if="staff.writers?.length" class="crew-item">
            <h3>Сценаристы</h3>
            <p>{{ staff.writers.join(', ') }}</p>
          </div>

          <div v-if="staff.composers?.length" class="crew-item">
            <h3>Композиторы</h3>
            <p>{{ staff.composers.join(', ') }}</p>
          </div>

          <div v-if="staff.operators?.length" class="crew-item">
            <h3>Операторы</h3>
            <p>{{ staff.operators.join(', ') }}</p>
          </div>

          <div v-if="staff.editors?.length" class="crew-item">
            <h3>Монтажёры</h3>
            <p>{{ staff.editors.join(', ') }}</p>
          </div>
          <div v-if="actors?.length" class="crew-item actors-list">
            <h3>Актерский состав</h3>
            <div class="actors-grid">
              <div v-for="actor in actors" :key="actor.staffId" class="actor-item">
                <p class="actor-name">
                  {{ actor.nameRu || actor.nameEn || actor.nameOriginal }}
                </p>
                <p v-if="actor.description" class="actor-role">
                  ({{ actor.description }})
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Медиа -->
      <div v-show="activeTab === 'media'" class="media-section">
        <div v-if="trailers.length" class="trailers-block">
          <h2>Трейлеры и тизеры</h2>
          <div class="trailers-grid">
            <div v-for="trailer in trailers" :key="trailer.url" class="trailer-item">
              <div v-if="trailer.site === 'YOUTUBE'" class="video-container">
                <iframe
                    v-if="trailer.embedUrl"
                    :src="trailer.embedUrl"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
              </div>
              <div v-else class="video-link">
                <a :href="trailer.url" target="_blank" rel="noopener noreferrer">
                  Смотреть на {{ trailer.site }} ({{ trailer.name }})
                </a>
              </div>
              <p v-if="trailer.name" class="trailer-name">{{ trailer.name }}</p>
            </div>
          </div>
        </div>

        <div v-if="frames.length" class="frames-block">
          <h2>Кадры из фильма</h2>
          <div class="frames-grid">
            <img
                v-for="(frame, index) in frames"
                :key="index"
                :src="frame.imageUrl"
                :alt="'Кадр из фильма ' + (movie.nameRu || movie.nameEn)"
                class="frame-image"
            />
          </div>
        </div>
      </div>

      <!-- Рецензии -->
      <div v-show="activeTab === 'reviews'" class="reviews-section">
        <div v-if="reviews.length" class="reviews-list">
          <h2>Рецензии</h2>
          <div v-for="(review, index) in reviews" :key="index" class="review-item">
            <div class="review-header">
              <h3 v-if="review.author">{{ review.author }}</h3>
              <div v-if="review.date" class="review-date">{{ review.date }}</div>
              <div v-if="review.rating" class="review-rating">
                Оценка: {{ review.rating }}
              </div>
            </div>
            <div class="review-content">
              <p>{{ review.reviewText || 'Рецензия отсутствует.' }}</p>

            </div>
          </div>
        </div>
        <div v-else><p>Рецензии отсутствуют.</p></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.movie-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
  background-color: #121212;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

.movie-header {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: flex-start;
}

.poster {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.movie-header-info {
  flex: 1;
}

.movie-header h1 {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.movie-meta {
  color: #aaa;
  margin-bottom: 18px;
  font-size: 1.1rem;
}

.rating-badge {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.kp-rating, .imdb-rating {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
}

.kp-rating {
  background-color: #ff9e00;
  color: #000;
}

.imdb-rating {
  background-color: #f5c518;
  color: #000;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 25px;
}

.tabs button {
  padding: 12px 20px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tabs button:hover {
  color: #fff;
}

.tabs button.active {
  color: #fff;
  font-weight: bold;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #ff9e00;
  border-radius: 2px;
}

.description-block,
.details-block,
.crew-grid,
.trailers-block,
.frames-block,
.reviews-list {
  margin-bottom: 48px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.detail-item {
  margin-bottom: 10px;
}

.genres-list,
.countries-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.genre-tag,
.country-tag {
  background-color: #2a2a2a;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
}

.crew-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.actors-list {
  grid-column: 1 / -1;
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.actor-item {
  padding: 12px;
  background-color: #1e1e1e;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.actor-item:hover {
  background-color: #252525;
}

.actor-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.actor-role {
  color: #999;
  font-size: 0.9em;
}

.trailers-grid,
.frames-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.trailer-item iframe {
  width: 100%;
  height: 200px;
  border-radius: 8px;
}

.trailer-name {
  margin-top: 10px;
  color: #aaa;
  text-align: center;
}

.frame-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.frame-image:hover {
  transform: scale(1.04);
}

.review-item {
  background-color: #1e1e1e;
  padding: 24px;
  border-radius: 10px;
  margin-bottom: 24px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.review-date {
  color: #aaa;
}

.review-rating {
  font-weight: bold;
  color: #ff9e00;
}

.review-title {
  font-weight: bold;
  margin-bottom: 12px;
}

.loading, .error {
  padding: 40px;
  text-align: center;
  font-size: 1.25rem;
  color: #ccc;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.video-link {
  padding: 16px;
  background-color: #2a2a2a;
  border-radius: 6px;
  text-align: center;
  transition: background-color 0.2s;
}

.video-link:hover {
  background-color: #333;
}

.video-link a {
  color: #ff9e00;
  text-decoration: none;
  font-weight: 500;
}

.video-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .movie-header {
    flex-direction: column;
  }

  .poster {
    width: 100%;
    height: auto;
    max-height: 500px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
