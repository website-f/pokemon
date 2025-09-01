<template>
  <div class="app-container">
    <div class="mb-3">
      <router-link to="/" class="back-button">&larr; Back to list</router-link>
    </div>

    <Loader v-if="store.loading" />
    <div v-if="store.error" class="alert alert-danger">{{ store.error }}</div>

    <div v-else-if="pokemon" class="vanguard-card" :class="getTypeClass(pokemon.types[0])">
      <div class="glitter-overlay"></div>
      <div class="card-content">
        <div class="card-header">
          <h2 class="poke-name text-capitalize">{{ displayName }}</h2>
          <span class="hp-badge">HP {{ pokemon.stats.find(s => s.name === 'hp')?.base }}</span>
        </div>

        <div class="image-types-section">
          <div class="poke-image-container">
            <img :src="pokemon.image" :alt="pokemon.name" class="poke-img" />
          </div>
          <div class="types">
            <span v-for="t in pokemon.types" :key="t" class="type-badge" :class="t">{{ t }}</span>
          </div>
        </div>
        
        <p v-if="customDescription" class="desc">{{ customDescription }}</p>
        <p v-else class="desc">No custom description – click Edit to add one.</p>

        <div class="stats-abilities-grid">
          <div class="stats-col">
            <h5 class="section-title">Stats</h5>
            <ul class="stats-list list-unstyled">
              <li v-for="s in pokemon.stats" :key="s.name" class="stat-item">
                <span class="stat-name text-capitalize">{{ s.name }}:</span>
                <span class="stat-value">{{ s.base }}</span>
              </li>
            </ul>
          </div>

          <div class="abilities-col">
            <h5 class="section-title">Abilities</h5>
            <ul class="abilities-list list-unstyled">
              <li v-for="a in pokemon.abilities" :key="a" class="ability-item text-capitalize">
                <span class="ability-icon">✨</span> {{ a }}
              </li>
            </ul>
          </div>
        </div>

        <button class="btn btn-edit-card" @click="openEdit">✏️ Edit Card</button>
      </div>
    </div>
    
    <div class="modal fade" id="editModal" ref="editModalRef" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <form class="modal-content stylish-modal" @submit.prevent="submitEdit">
          <div class="modal-header">
            <h5 class="modal-title">Edit Pokémon Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nickname</label>
              <input v-model="form.nickname" class="form-control" placeholder="Enter a custom nickname..." />
            </div>
            <div class="mb-3">
              <label class="form-label">Custom description</label>
              <textarea v-model="form.description" class="form-control" rows="4" placeholder="Describe your Pokémon..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '../stores/pokemon'
import Loader from '../components/Loader.vue'
import { Modal } from 'bootstrap'

const route = useRoute()
const store = usePokemonStore()
const id = route.params.id
const pokemon = ref(null)
const editModalRef = ref(null)
let editModal = null

const load = async () => {
  const data = await store.fetchDetail(id)
  if (data) pokemon.value = data
}

onMounted(async () => {
  await load()
})

const displayName = computed(() => {
  if (!pokemon.value) return ''
  return store.getDisplayName(String(pokemon.value.id), pokemon.value.name)
})

const customDescription = computed(() => {
  if (!pokemon.value) return ''
  return store.getCustomDescription(String(pokemon.value.id))
})

const getTypeClass = (type) => {
  if (!type) return 'type-normal';
  return `type-${type.toLowerCase()}`;
}

const form = ref({ nickname: '', description: '' })
function openEdit() {
  if (!pokemon.value) return
  form.value.nickname = store.overrides[String(pokemon.value.id)]?.nickname || ''
  form.value.description = store.overrides[String(pokemon.value.id)]?.description || ''
  if (!editModal) editModal = new Modal(editModalRef.value)
  editModal.show()
}

function submitEdit() {
  store.saveOverride(String(pokemon.value.id), { nickname: form.value.nickname, description: form.value.description })
  pokemon.value = { ...pokemon.value, ...store.overrides[String(pokemon.value.id)] }
  if (editModal) editModal.hide()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

/* --- General and Container Styles --- */
.app-container {
    background: #121212; /* Darker, more cohesive background */
    min-height: 100vh;
    padding: 2rem 1rem; /* Adjust padding for mobile */
}

.back-button {
    color: #a0a0a0;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;
    padding: 0 1rem;
    display: block;
    font-size: 0.9rem;
}

.back-button:hover {
    color: #e0e0e0;
}

/* --- Card Styles --- */
.vanguard-card {
    max-width: 550px;
    margin: 2rem auto;
    position: relative;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    z-index: 1;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.6); /* Fallback for browsers without backdrop-filter */
    animation: glow-border 5s infinite alternate; /* Animate the border glow */
}

/* Color gradients based on type */
.vanguard-card.type-fire { background: linear-gradient(135deg, #f7797d, #FBD786); }
.vanguard-card.type-water { background: linear-gradient(135deg, #43cea2, #185a9d); }
.vanguard-card.type-grass { background: linear-gradient(135deg, #56ab2f, #a8e063); }
.vanguard-card.type-electric { background: linear-gradient(135deg, #f7971e, #ffd200); }
.vanguard-card.type-ice { background: linear-gradient(135deg, #83a4d4, #b6fbff); }
.vanguard-card.type-fighting { background: linear-gradient(135deg, #cb356b, #bd3f32); }
.vanguard-card.type-poison { background: linear-gradient(135deg, #6a11cb, #2575fc); }
.vanguard-card.type-ground { background: linear-gradient(135deg, #eacda3, #d6ae7b); }
.vanguard-card.type-flying { background: linear-gradient(135deg, #89f7fe, #66a6ff); }
.vanguard-card.type-psychic { background: linear-gradient(135deg, #ff6a88, #ff99ac); }
.vanguard-card.type-bug { background: linear-gradient(135deg, #76b852, #8DC26F); }
.vanguard-card.type-rock { background: linear-gradient(135deg, #757f9a, #d7dde8); }
.vanguard-card.type-ghost { background: linear-gradient(135deg, #42275a, #734b6d); }
.vanguard-card.type-dragon { background: linear-gradient(135deg, #20002c, #cbb4d4); }
.vanguard-card.type-dark { background: linear-gradient(135deg, #232526, #414345); }
.vanguard-card.type-steel { background: linear-gradient(135deg, #bdc3c7, #2c3e50); }
.vanguard-card.type-fairy { background: linear-gradient(135deg, #fcb69f, #ffdde1); }
.vanguard-card.type-normal { background: linear-gradient(135deg, #ece9e6, #ffffff); }

/* Animated border effect */
.vanguard-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 22px;
    background: conic-gradient(from 180deg at 50% 50%, #4c4cff 0deg, #8a2be2 120deg, #ff00ff 240deg, #4c4cff 360deg);
    opacity: 0.5;
    filter: blur(20px);
    z-index: -1;
    transition: opacity 0.5s ease;
    animation: rotate 4s linear infinite;
}

.vanguard-card:hover::before {
    opacity: 1;
}

/* Glitter effect */
.glitter-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/svg+xml;base64,...'); /* Base64 SVG or a real image for glitter */
    background-size: 100px 100px;
    opacity: 0.2;
    pointer-events: none;
    animation: sparkle 1s infinite alternate;
}

.card-content {
    position: relative;
    z-index: 2;
    background-color: rgba(18, 18, 18, 0.95); /* Darker, semi-transparent background */
    border-radius: 18px;
    padding: 1.5rem; /* Reduced padding for mobile */
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.poke-name {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 2rem; /* Reduced for mobile */
    color: #fff;
    line-height: 1.2;
    letter-spacing: -1px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Added subtle text shadow */
}

.hp-badge {
    background: #333;
    color: #fff;
    font-weight: 600;
    padding: 0.3rem 0.7rem;
    border-radius: 5px;
    font-size: 0.8rem;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.image-types-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1.5rem;
}

.poke-image-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px); /* Frosted glass effect */
    -webkit-backdrop-filter: blur(8px);
}

.poke-img {
    max-height: 180px; /* Reduced for mobile */
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
    transition: transform 0.4s ease, filter 0.4s ease;
}

.vanguard-card:hover .poke-img {
    transform: scale(1.05);
    filter: drop-shadow(0 0 15px #00e5ff);
}

.types {
    margin-top: 0;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap; /* Allow types to wrap on small screens */
}

.type-badge {
    /* ... (Your existing type badge styles are fine) ... */
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
}

.desc {
    font-style: italic;
    font-size: 0.9rem; /* Reduced for mobile */
    margin: 1.5rem 0;
    color: #ccc; /* Slightly lighter for readability */
    min-height: 2.5em;
    text-align: center;
}

.stats-abilities-grid {
    display: grid;
    grid-template-columns: 1fr; /* Stack columns on mobile */
    gap: 1.5rem; /* Reduced gap */
    margin-bottom: 1.5rem;
}

.section-title {
    font-size: 1.1rem; /* Reduced for mobile */
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.8rem;
    border-bottom: 2px solid #585858;
    padding-bottom: 0.3rem;
    letter-spacing: 0.5px;
}

.stats-list, .abilities-list {
    padding-left: 0;
}

.stat-item, .ability-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem; /* Reduced for mobile */
    padding: 0.3rem 0;
    color: #a0a0a0;
}

.stat-name, .ability-item {
    font-weight: 400;
}

.stat-value {
    font-weight: bold;
    color: #fff;
}

.ability-icon {
    font-size: 1.2em;
    margin-right: 0.5rem;
    color: #00e5ff;
    text-shadow: 0 0 5px #00e5ff; /* Added glow to icon */
}

.btn-edit-card {
    width: 100%;
    background: #00e5ff;
    color: #121212;
    font-weight: bold;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-edit-card:hover {
    background: #00b8d4;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.4);
}

/* --- Modal Styling --- */
.stylish-modal {
    border-radius: 16px;
    background: rgba(30, 30, 30, 0.95);
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
    font-weight: 600;
    color: #fff;
    font-size: 1.3rem; /* Reduced for mobile */
}

.modal-header .btn-close {
    filter: invert(1);
    color: #fff; /* Ensure the close button is visible */
}

.form-label {
    color: #e0e0e0;
}

.form-control {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
}

.form-control::placeholder {
    color: #888;
}

.modal-footer .btn-primary {
    background: #00e5ff;
    border-color: #00e5ff;
    color: #121212;
}

.modal-footer .btn-primary:hover {
    background: #00b8d4;
    border-color: #00b8d4;
}

/* --- Media Queries for Larger Screens --- */
@media (min-width: 768px) {
    .app-container {
        padding: 3rem 0;
    }

    .back-button {
        padding-left: 2rem;
        font-size: 1rem;
    }

    .card-content {
        padding: 2.5rem;
    }

    .poke-name {
        font-size: 2.8rem;
    }

    .hp-badge {
        font-size: 0.9rem;
    }

    .poke-img {
        max-height: 220px;
    }

    .desc {
        font-size: 1rem;
    }

    .stats-abilities-grid {
        grid-template-columns: 1fr 1fr; /* Return to two columns */
        gap: 2rem;
    }

    .section-title {
        font-size: 1.2rem;
    }

    .stat-item, .ability-item {
        font-size: 1rem;
    }
}

/* --- Animations --- */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes sparkle {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 100px 100px;
    }
}
</style>