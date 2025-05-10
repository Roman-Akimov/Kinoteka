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
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main {
  flex: 7;
  overflow-y: auto;
  padding: 20px;
  background-color: #100f0f;
}

.filter {
  flex: 3;
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
  overflow-y: auto;
}
</style>
