<!-- components/Head.vue -->
<template>
  <header class="header">
    <div class="logo-container">
      <!-- Замените src на путь к вашему логотипу -->
      <img src="@/assets/img_1.png" alt="Кинотека" class="logo" />
    </div>
  </header>
</template>

<script setup>
// логика пока не требуется
</script>

<style scoped>
.header {
  background-color: #050505;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #333;
}

.logo-container {
  text-align: center;
}

.logo {
  max-height: 120px;
  object-fit: contain;
}
</style>
