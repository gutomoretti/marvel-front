<template>
  <section class="stack">
    <div class="card stack header-card">
      <div>
        <p class="eyebrow">{{ isEdit ? 'Edição' : 'Cadastro' }}</p>
        <h2>{{ isEdit ? 'Editar super-herói' : 'Novo super-herói' }}</h2>
        <p class="muted">
          Todos os campos são obrigatórios. Validação baseada no contrato da API.
        </p>
      </div>
      <RouterLink class="btn ghost" to="/">Voltar</RouterLink>
    </div>

    <form class="card stack" @submit.prevent="handleSubmit">
      <div class="grid two">
        <div class="stack">
          <label class="label" for="name">
            Nome <span class="helper">(mín. 2 caracteres)</span>
          </label>
          <input id="name" v-model="form.name" class="input" type="text" />
          <p v-if="errors.name" class="helper danger">{{ errors.name }}</p>
        </div>

        <div class="stack">
          <label class="label" for="heroName">
            Codinome <span class="helper">(único, mín. 2 caracteres)</span>
          </label>
          <input id="heroName" v-model="form.heroName" class="input" type="text" />
          <p v-if="errors.heroName" class="helper danger">{{ errors.heroName }}</p>
        </div>
      </div>

      <div class="grid two">
        <div class="stack">
          <label class="label" for="birthDate">Data de nascimento</label>
          <input id="birthDate" v-model="form.birthDate" class="input" type="date" />
          <p v-if="errors.birthDate" class="helper danger">{{ errors.birthDate }}</p>
        </div>

        <div class="grid two small-grid">
          <div class="stack">
            <label class="label" for="height">Altura (m)</label>
            <input
              id="height"
              v-model.number="form.height"
              class="input"
              type="number"
              step="0.01"
              min="0.3"
              max="3"
            />
            <p v-if="errors.height" class="helper danger">{{ errors.height }}</p>
          </div>
          <div class="stack">
            <label class="label" for="weight">Peso (kg)</label>
            <input
              id="weight"
              v-model.number="form.weight"
              class="input"
              type="number"
              step="0.1"
              min="1"
              max="1000"
            />
            <p v-if="errors.weight" class="helper danger">{{ errors.weight }}</p>
          </div>
        </div>
      </div>

      <div class="stack">
        <div class="label">
          Superpoderes
          <span class="helper">Selecione ao menos um</span>
        </div>
        <div v-if="powersError" class="pill danger">{{ powersError }}</div>
        <div v-else-if="loadingPowers" class="pill">Carregando superpoderes...</div>
        <div class="powers">
          <label v-for="power in superpowers" :key="power.id" class="power-item">
            <input
              v-model="form.superpowerIds"
              :value="power.id"
              type="checkbox"
              class="checkbox"
            />
            <div>
              <div class="power-name">{{ power.name }}</div>
              <div class="helper">{{ power.description || 'Sem descrição' }}</div>
            </div>
          </label>
        </div>
        <p v-if="errors.superpowerIds" class="helper danger">{{ errors.superpowerIds }}</p>
      </div>

      <div v-if="feedback" class="pill success">{{ feedback }}</div>
      <div v-if="submitError" class="pill danger">{{ submitError }}</div>

      <div class="actions">
        <button type="button" class="btn ghost" @click="resetForm" :disabled="loadingHero || saving">
          Limpar
        </button>
        <button type="submit" class="btn primary" :disabled="saving || loadingHero">
          {{ saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import type { HeroPayload, Superpower } from '../api/types';
import { createHero, fetchHero, fetchSuperpowers, updateHero } from '../api/client';

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string | undefined);
const isEdit = computed(() => route.name === 'edit-hero' && !!id.value);

const form = reactive<HeroPayload>({
  name: '',
  heroName: '',
  birthDate: '',
  height: null,
  weight: null,
  superpowerIds: []
});

const errors = reactive<Record<string, string>>({});
const superpowers = ref<Superpower[]>([]);
const loadingPowers = ref(false);
const powersError = ref('');
const loadingHero = ref(false);
const saving = ref(false);
const feedback = ref('');
const submitError = ref('');

const validate = () => {
  errors.name = '';
  errors.heroName = '';
  errors.birthDate = '';
  errors.height = '';
  errors.weight = '';
  errors.superpowerIds = '';

  if (!form.name || form.name.trim().length < 2) errors.name = 'Nome obrigatório (mín. 2)';
  if (!form.heroName || form.heroName.trim().length < 2)
    errors.heroName = 'Codinome obrigatório (mín. 2)';
  if (!form.birthDate) errors.birthDate = 'Data obrigatória';

  if (form.height !== null && form.height !== undefined) {
    if (form.height < 0.3 || form.height > 3) {
      errors.height = 'Altura entre 0.3 e 3 metros';
    }
  }

  if (form.weight !== null && form.weight !== undefined) {
    if (form.weight < 1 || form.weight > 1000) {
      errors.weight = 'Peso entre 1 e 1000 kg';
    }
  }

  if (!form.superpowerIds.length) errors.superpowerIds = 'Selecione ao menos um superpoder';

  return !Object.values(errors).some(Boolean);
};

const resetForm = () => {
  form.name = '';
  form.heroName = '';
  form.birthDate = '';
  form.height = null;
  form.weight = null;
  form.superpowerIds = [];
  feedback.value = '';
  submitError.value = '';
  Object.keys(errors).forEach((key) => (errors[key] = ''));
};

const loadSuperpowers = async () => {
  loadingPowers.value = true;
  powersError.value = '';
  try {
    superpowers.value = await fetchSuperpowers();
  } catch (err) {
    powersError.value = (err as Error).message ?? 'Falha ao carregar superpoderes';
  } finally {
    loadingPowers.value = false;
  }
};

const fillFormFromHero = (hero: any) => {
  form.name = hero.name;
  form.heroName = hero.heroName;
  form.birthDate = formatDate(hero.birthDate);
  form.height = hero.height ?? null;
  form.weight = hero.weight ?? null;
  form.superpowerIds = (hero.superpowers || []).map((p: Superpower) => p.id);
};

const loadHero = async () => {
  if (!id.value) return;
  loadingHero.value = true;
  try {
    const hero = await fetchHero(id.value);
    fillFormFromHero(hero);
  } catch (err) {
    submitError.value = (err as Error).message ?? 'Falha ao carregar herói';
  } finally {
    loadingHero.value = false;
  }
};

const handleSubmit = async () => {
  submitError.value = '';
  feedback.value = '';
  if (!validate()) return;

  saving.value = true;
  try {
    if (isEdit.value && id.value) {
      await updateHero(id.value, form);
      feedback.value = 'Herói atualizado com sucesso';
    } else {
      const created = await createHero(form);
      feedback.value = 'Herói cadastrado com sucesso';
      router.replace(`/heroes/${created.id}`);
      return;
    }
    await router.replace(`/heroes/${id.value}`);
  } catch (err) {
    submitError.value = (err as Error).message ?? 'Falha ao salvar';
  } finally {
    saving.value = false;
  }
};

const formatDate = (date: string) => {
  if (!date) return '';
  if (date.length === 10 && date.includes('-')) return date;
  const parsed = new Date(date);
  const iso = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  return iso;
};

onMounted(async () => {
  await loadSuperpowers();
  if (isEdit.value) await loadHero();
});
</script>

<style scoped>
.header-card {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

h2 {
  margin: 4px 0;
}

.muted {
  color: rgba(233, 237, 242, 0.65);
  margin: 0;
}

.small-grid {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.powers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.power-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.checkbox {
  margin-top: 4px;
}

.power-name {
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
