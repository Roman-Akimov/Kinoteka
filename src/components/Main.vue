<script setup>
import { onMounted, ref } from "vue";
import { fetchMovies } from "@/api.js";

const movies = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const data = await fetchMovies({ page: 1 });
    movies.value = data.items;
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="main-container">
    <h1 class="title">Главная</h1>
    <div class="txt" v-if="isLoading">Подождите, идёт обработка...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <div v-else class="movies-grid">
      <div v-for="movie in movies" :key="movie.kinopoiskId" class="movie-card">
        <img :src="movie.posterUrlPreview" :alt="movie.nameRu" class="poster" />
        <p class="movie-title">{{ movie.nameRu || movie.nameEn }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  background-color: #100f0f;
  padding: 20px;
}

.title {
  color: azure;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.txt{color: azure}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.movie-card {
  background: #ccc9c9;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.poster {
  width: 100%;
  border-radius: 4px;
}

.movie-title {
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
}
</style>
