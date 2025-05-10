<script setup>
import { ref, watch } from "vue";

// Принимаем пропсы
const props = defineProps({
  filters: Object,
  genres: Array,
  countries: Array,
  years: Array
});

const emit = defineEmits(["update-filters"]);

// Локальная копия фильтров
const localFilters = ref({
  genre: null,
  country: null,
  year: null,
  ratingFrom: null,
  ratingTo: null,
  sortBy: "RATING",
  ...props.filters
});

// Наблюдаем за изменениями фильтров и передаём наверх
watch(localFilters, (newVal) => {
  emit("update-filters", newVal);
}, { deep: true });

// Сброс фильтров к значениям по умолчанию
const resetFilters = () => {
  localFilters.value = {
    genre: null,
    country: null,
    year: null,
    ratingFrom: null,
    ratingTo: null,
    sortBy: "RATING"
  };
};

const error = ref(null)

const loadFilterData = async () => {
  try {
    genres.value = await fetchGenres()
    countries.value = await fetchCountries()
    error.value = null
  } catch (err) {
    error.value = 'Не удалось загрузить фильтры'
    console.error(err)
  }
}

console.log("Genres:", props.genres);
console.log("Countries:", props.countries);
console.log("Years:", props.years);
</script>

<template>
  <div v-if="!genres.length" class="loading">Загрузка фильтров...</div>
  <div class="filter-container">
    <h2 class="filter-title">Фильтры</h2>

    <!-- Жанры -->
    <div class="filter-group">
      <label>Жанр:</label>
      <select v-model="localFilters.genre">
        <option :value="null">Все жанры</option>
        <option
            v-for="genre in props.genres"
            :key="genre.id || genre.genre"
            :value="genre.id || genre.genre"
        >
          {{ genre.genre || genre.name }}
        </option>
      </select>
    </div>

    <!-- Страны -->
    <div class="filter-group">
      <label>Страна:</label>
      <select v-model="localFilters.country">
        <option :value="null">Все страны</option>
        <option
            v-for="country in props.countries"
            :key="country.id || country.country"
            :value="country.id || country.country"
        >
          {{ country.country || country.name }}
        </option>
      </select>
    </div>

    <!-- Год -->
    <div class="filter-group">
      <label>Год:</label>
      <select v-model="localFilters.year">
        <option :value="null">Все годы</option>
        <option
            v-for="year in years"
            :key="year"
            :value="year"
        >
          {{ year }}
        </option>
      </select>
    </div>

    <!-- Рейтинг -->
    <div class="filter-group">
      <label>Рейтинг:</label>
      <div class="rating-range">
        <input
            v-model.number="localFilters.ratingFrom"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="От"
            class="rating-input"
        />
        <span class="rating-separator">—</span>
        <input
            v-model.number="localFilters.ratingTo"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="До"
            class="rating-input"
        />
      </div>
    </div>

    <!-- Сортировка -->
    <div class="filter-group">
      <label>Сортировать по:</label>
      <select v-model="localFilters.sortBy">
        <option value="RATING">Рейтингу (высокий → низкий)</option>
        <option value="NUM_VOTE">Количеству голосов</option>
        <option value="YEAR">Году (новые → старые)</option>
      </select>
    </div>

    <div class="filter-actions">
      <button @click="resetFilters" class="reset-btn">
        Сбросить фильтры
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  padding: 25px;
  background-color: #1e1e1e;
  color: #fff;
  border-left: 1px solid #333;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #444 #1e1e1e;
}

/* Webkit scrollbar (Chrome, Edge, Safari) */
.filter-container::-webkit-scrollbar {
  width: 8px;
}

.filter-container::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.filter-container::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 4px;
}

.filter-title {
  margin-top: 0;
  margin-bottom: 24px;
  color: #fff;
  font-size: 1.6rem;
  font-weight: bold;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.filter-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #ddd;
  font-size: 0.95rem;
}

select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

select:focus {
  border-color: #ff9e00;
  outline: none;
  background-color: #2f2f2f;
}

.rating-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.rating-input:focus {
  border-color: #ff9e00;
  outline: none;
}

.rating-separator {
  color: #777;
  font-size: 1rem;
}

.filter-actions {
  margin-top: 30px;
}

button {
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-btn {
  background-color: #444;
  color: #fff;
}

.reset-btn:hover {
  background-color: #555;
}

.loading {
  color: #aaa;
  text-align: center;
  padding: 12px;
  font-size: 1rem;
  font-style: italic;
}
</style>
