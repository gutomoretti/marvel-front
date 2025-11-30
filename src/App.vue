<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="dot"></span>
        <div>
          <p class="eyebrow">Marvel Challenge</p>
          <h1>Heróis</h1>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active">Listagem</RouterLink>
        <RouterLink to="/heroes/new" class="nav-link" exact-active-class="nav-link--active">
          Novo herói
        </RouterLink>
      </nav>
    </header>

    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(80% 80% at 20% 20%, rgba(255, 77, 90, 0.08), transparent),
    radial-gradient(60% 60% at 80% 0%, rgba(102, 217, 232, 0.06), transparent),
    #0c0f14;
  color: #e9edf2;
  font-family: 'Space Grotesk', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(12, 15, 20, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand .dot {
  width: 12px;
  height: 32px;
  background: linear-gradient(180deg, #ff4d5a 0%, #ff9f43 100%);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(255, 77, 90, 0.35);
}

.brand h1 {
  margin: 0;
  font-size: 22px;
  letter-spacing: 0.8px;
}

.eyebrow {
  margin: 0 0 2px;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 1.6px;
  color: rgba(233, 237, 242, 0.7);
}

.nav {
  display: flex;
  gap: 14px;
}

.nav-link {
  padding: 10px 14px;
  border-radius: 10px;
  color: rgba(233, 237, 242, 0.85);
  text-decoration: none;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-weight: 600;
}

.nav-link:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
}

.nav-link--active {
  background: linear-gradient(90deg, #ff4d5a, #ff9f43);
  color: #0c0f14;
  border-color: transparent;
  box-shadow: 0 10px 30px rgba(255, 77, 90, 0.25);
}

.page {
  max-width: 1200px;
  margin: 32px auto 80px;
  padding: 0 24px 24px;
}
</style>
