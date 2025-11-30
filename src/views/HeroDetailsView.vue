<template>
  <section class="stack">
    <div class="card stack header-card">
      <div>
        <p class="eyebrow">Ficha</p>
        <h2>{{ hero?.heroName ?? 'Herói' }}</h2>
        <p class="muted">Dados carregados diretamente da API.</p>
      </div>
      <div class="actions">
        <RouterLink v-if="hero" :to="`/heroes/${hero.id}/edit`" class="btn secondary">
          Editar
        </RouterLink>
        <RouterLink to="/" class="btn ghost">Voltar</RouterLink>
      </div>
    </div>

    <div class="card stack">
      <div v-if="error" class="pill danger">{{ error }}</div>
      <div v-else-if="loading" class="pill">Carregando...</div>
      <div v-else-if="!hero" class="pill danger">Herói não encontrado</div>
      <div v-else class="grid two">
        <div class="stack">
          <p class="label">Nome</p>
          <p class="value">{{ hero.name }}</p>

          <p class="label">Codinome</p>
          <p class="value">{{ hero.heroName }}</p>

          <p class="label">Data de nascimento</p>
          <p class="value">{{ formatDate(hero.birthDate) }}</p>
        </div>
        <div class="stack">
          <p class="label">Altura</p>
          <p class="value">{{ formatNumber(hero.height) }} m</p>

          <p class="label">Peso</p>
          <p class="value">{{ formatNumber(hero.weight) }} kg</p>

          <p class="label">Superpoderes</p>
          <div class="chips">
            <span v-for="power in hero.superpowers" :key="power.id" class="pill">
              {{ power.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { fetchHero } from '../api/client';
import type { Hero } from '../api/types';

const route = useRoute();
const id = route.params.id as string;

const hero = ref<Hero | null>(null);
const loading = ref(true);
const error = ref('');

const loadHero = async () => {
  loading.value = true;
  error.value = '';
  try {
    hero.value = await fetchHero(id);
  } catch (err) {
    error.value = (err as Error).message ?? 'Falha ao carregar herói';
  } finally {
    loading.value = false;
  }
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

onMounted(loadHero);
</script>

<style scoped>
.header-card {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.muted {
  color: rgba(233, 237, 242, 0.65);
  margin: 0;
}

.value {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
