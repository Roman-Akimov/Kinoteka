<script setup>
import { ref, watch, onMounted } from 'vue'
import { fetchMovies } from '@/api.js'
import { useRouter } from 'vue-router' // Для навигации

const props = defineProps({
  filters: Object
})

const movies = ref([])
const isLoading = ref(true)
const error = ref(null)
const currentPage = ref(1)

const router = useRouter()

const loadMovies = async () => {
  isLoading.value = true
  try {
    const data = await fetchMovies({ page: currentPage.value, ...props.filters })
    movies.value = data.items
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

watch(() => props.filters, () => {
  currentPage.value = 1
  loadMovies()
}, { deep: true })

watch(currentPage, loadMovies)

onMounted(loadMovies)

const nextPage = () => currentPage.value++
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Функция для перехода на страницу с деталями фильма
const goToMovieDetail = (movieId) => {
  router.push(`/movie/${movieId}`)
}
</script>

<template>
  <div class="main-container">
    <h1 class="title">Главная</h1>

    <div v-if="isLoading">Подождите, идёт обработка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>

    <div v-else>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
        <span>Страница {{ currentPage }}</span>
        <button @click="nextPage">Вперёд</button>
      </div>

      <div class="movies-grid">
        <div
            v-for="movie in movies"
            :key="movie.kinopoiskId"
            class="movie-card"
            @click="goToMovieDetail(movie.kinopoiskId)"
        >
          <img :src="movie.posterUrlPreview" :alt="movie.nameRu || movie.nameEn" class="poster" />
          <div class="movie-info">
            <p class="movie-title">{{ movie.nameRu || movie.nameEn || movie.nameOriginal }}</p>
            <p class="movie-year">Год: {{ movie.year || 'Неизвестен' }}</p>
            <p class="movie-rating">Рейтинг: {{ movie.ratingKinopoisk ?? movie.ratingImdb ?? 'N/A' }}</p>
          </div>
        </div>
      </div>

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
        <span>Страница {{ currentPage }}</span>
        <button @click="nextPage">Вперёд</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  color: white;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.title {
  margin: 10px;
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
}

.pagination {
  margin: 30px 0 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

button {
  padding: 8px 16px;
  background-color: #2f2e2e;
  color: white;
  border: 1px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  font-family: inherit;
  font-size: 14px;
}

button:hover {
  background-color: #444;
  transform: scale(1.05);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.movie-card {
  background-color: #1c1c1c;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: inherit;
}

.movie-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 6px;
}

.movie-info {
  margin-top: 12px;
}

.movie-title {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: #fff;
}

.movie-year,
.movie-rating {
  font-size: 0.9rem;
  color: #aaa;
}
</style>

