<template>
  <section class="stack">
    <div class="card stack header-card">
      <div>
        <p class="eyebrow">Dashboard</p>
        <h2>Super-heróis cadastrados</h2>
        <p class="muted">Sistema para controle de Super-heróis.</p>
      </div>
      <RouterLink class="btn primary" to="/heroes/new">Cadastrar herói</RouterLink>
    </div>

    <div class="card stack">
      <div class="table-toolbar">
        <div class="pill">Total: {{ heroes.length }}</div>
        <button class="btn ghost" @click="loadHeroes" :disabled="loading">
          Atualizar
        </button>
      </div>

      <div v-if="error" class="pill danger">Erro: {{ error }}</div>
      <div v-else-if="loading" class="pill">Carregando...</div>
      <div v-else-if="!heroes.length" class="empty">
        <p>Nenhum herói cadastrado ainda.</p>
        <RouterLink to="/heroes/new" class="btn primary">Começar cadastro</RouterLink>
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Codinome</th>
            <th>Superpoderes</th>
            <th>Altura</th>
            <th>Peso</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hero in heroes" :key="hero.id">
            <td>
              <RouterLink :to="`/heroes/${hero.id}`" class="link">
                {{ hero.name }}
              </RouterLink>
            </td>
            <td>{{ hero.heroName }}</td>
            <td>
              <div class="chips">
                <span v-for="power in hero.superpowers" :key="power.id" class="pill">
                  {{ power.name }}
                </span>
              </div>
            </td>
            <td>{{ formatNumber(hero.height) }} m</td>
            <td>{{ formatNumber(hero.weight) }} kg</td>
            <td class="actions">
              <RouterLink :to="`/heroes/${hero.id}`" class="btn ghost">Detalhes</RouterLink>
              <RouterLink :to="`/heroes/${hero.id}/edit`" class="btn secondary">
                Editar
              </RouterLink>
              <button class="btn danger-btn" @click="confirmDelete(hero)" :disabled="deletingId === hero.id">
                {{ deletingId === hero.id ? 'Excluindo...' : 'Excluir' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Hero } from '../api/types';
import { deleteHero, fetchHeroes } from '../api/client';

const heroes = ref<Hero[]>([]);
const loading = ref(true);
const error = ref('');
const deletingId = ref<string | null>(null);

const loadHeroes = async () => {
  loading.value = true;
  error.value = '';
  try {
    heroes.value = await fetchHeroes();
  } catch (err) {
    error.value = (err as Error).message ?? 'Falha ao carregar heróis';
  } finally {
    loading.value = false;
  }
};

const confirmDelete = async (hero: Hero) => {
  const sure = window.confirm(`Excluir definitivamente ${hero.heroName}?`);
  if (!sure) return;

  deletingId.value = hero.id;
  try {
    await deleteHero(hero.id);
    heroes.value = heroes.value.filter((h) => h.id !== hero.id);
  } catch (err) {
    window.alert((err as Error).message ?? 'Falha ao excluir');
  } finally {
    deletingId.value = null;
  }
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

onMounted(loadHeroes);
</script>

<style scoped>
.header-card {
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: 24px;
}

.header-card h2 {
  margin: 4px 0;
}

.muted {
  color: rgba(233, 237, 242, 0.65);
  margin: 0;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.link {
  color: #7de0ff;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.danger-btn {
  border: 1px solid rgba(255, 124, 124, 0.4);
  background: rgba(255, 77, 90, 0.08);
  color: #ff7b7b;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  padding: 16px;
  border-radius: 12px;
}
</style>
