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
}

.title{
  margin: 20px;
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 6px 12px;
  background-color: #2e2e2e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.movie-card {
  background-color: #1c1c1c;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer; /* Указываем, что элемент кликабельный */
}

.movie-card:hover {
  transform: scale(1.03);
}

.poster {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.movie-info {
  margin-top: 10px;
}

.movie-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.movie-year,
.movie-rating {
  font-size: 14px;
  color: #ccc;
}
</style>
