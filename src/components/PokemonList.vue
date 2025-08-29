<template>
  <div>
    <div class="d-flex flex-column flex-md-row justify-content-center align-items-center mb-5 gap-2">
      <div class="input-group w-100 w-md-50">
        <input v-model="query" @input="onFilter" placeholder="Search by name or id..." class="form-control rounded-pill" />
        <button v-if="query" class="btn btn-outline-danger rounded-pill ms-2" @click="clearSearch">❌</button>
      </div>
    </div>
    
    <Loader v-if="store.loading" />
    <div v-if="store.error" class="alert alert-danger text-center">{{ store.error }}</div>

    <div v-else class="row g-4 justify-content-center">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="p in paginated" :key="p.id">
        <PokemonCard :pokemon="p" />
      </div>
    </div>
    
    <nav class="mt-5" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="goPage(page - 1)">Previous</button>
        </li>
        <li v-for="n in pageButtons" :key="n" class="page-item" :class="{ active: n === page }">
          <button class="page-link" @click="goPage(n)">{{ n }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="goPage(page + 1)">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePokemonStore } from '../stores/pokemon'
import PokemonCard from './PokemonCard.vue'
import Loader from './Loader.vue'

const store = usePokemonStore()
const query = ref('')
const page = ref(1)
const pageSize = ref(20)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return store.list
  return store.list.filter(p => p.name.includes(q) || String(p.id).includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

const pageButtons = computed(() => {

  const t = totalPages.value
  const maxButtons = 7
  let start = Math.max(1, page.value - Math.floor(maxButtons / 2))
  let end = Math.min(t, start + maxButtons - 1)
  start = Math.max(1, end - maxButtons + 1)
  const arr = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})

function goPage(n) {
  if (n < 1) n = 1
  if (n > totalPages.value) n = totalPages.value
  page.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function refresh() {
  store.fetchList(100)
}

function onFilter() { page.value = 1 }
function clearSearch() { query.value = ''; onFilter() }

onMounted(() => {
  if (!store.list || store.list.length === 0) {
    store.fetchList(100)
  }
})

watch(pageSize, () => goPage(1))
</script>
