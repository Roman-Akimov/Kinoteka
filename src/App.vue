<script setup>
import Head from "@/components/Head.vue"
import Filter from "@/components/Filter.vue"
import { ref, onMounted } from 'vue'
import { fetchGenres, fetchCountries, generateYears } from '@/api.js'

const filters = ref({})
const genres = ref([])
const countries = ref([])
const years = ref(generateYears())

// Загрузка данных фильтров
const loadFilterData = async () => {
  try {
    genres.value = await fetchGenres()
    countries.value = await fetchCountries()
  } catch (error) {
    console.error("Error loading filter data:", error)
  }
}

onMounted(loadFilterData)

const onFilterChange = (newFilters) => {
  filters.value = { ...newFilters }
}
</script>

<template>
  <div class="body">
  <div class="app-kino">
    <Head />
    <div class="content">
      <div class="main">
        <router-view :filters="filters" @update-filters="onFilterChange" />
      </div>
      <div class="filter">
        <Filter
            :filters="filters"
            :genres="genres"
            :countries="countries"
            :years="years"
            @update-filters="onFilterChange"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.app-kino {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main {
  flex: 7.8;
  overflow-y: auto;
  padding: 20px;
  background-color: #100f0f;

  /* Стилизация скроллбара */
  scrollbar-width: thin;
  scrollbar-color: #555 #1e1e1e;
}

.main::-webkit-scrollbar {
  width: 8px;
}

.main::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.main::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}

.filter {
  flex: 2.2;
  background-color: #1a1a1a;
  color: #fdfdfd;
  padding: 20px;
  overflow-y: auto;

  /* Стилизация скроллбара */
  scrollbar-width: thin;
  scrollbar-color: #555 #1e1e1e;
}

.filter::-webkit-scrollbar {
  width: 8px;
}

.filter::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.filter::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}
</style>
