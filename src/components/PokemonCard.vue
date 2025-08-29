<template>
  <router-link
    :to="{ name: 'Detail', params: { id: pokemon.id } }"
    class="pokemon-card-link"
  >
    <div class="pokemon-card" :class="firstType">
      <div class="image-wrapper">
        <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-img" />
      </div>

      <div class="content">
        <h5 class="name">{{ displayName }}</h5>
        <p class="id small">#{{ pokemon.id }} · {{ pokemon.name }}</p>

        <div class="types">
          <span
            v-for="t in types"
            :key="t"
            class="type-badge"
            :class="t"
          >{{ t }}</span>
        </div>

        <p class="desc">
          {{ customDescription || 'Click to view details and add a note.' }}
        </p>

        <div class="btn-view">View Details →</div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { usePokemonStore } from '../stores/pokemon'

const props = defineProps({
  pokemon: { type: Object, required: true }
})
const store = usePokemonStore()

const displayName = computed(() =>
  store.getDisplayName(String(props.pokemon.id), props.pokemon.name)
)
const customDescription = computed(() =>
  store.getCustomDescription(String(props.pokemon.id))
)
const types = computed(() => {
  const det = store.details[String(props.pokemon.id)]
  return det ? det.types : []
})
const firstType = computed(() => types.value[0] || 'normal')
</script>

<style scoped>
.pokemon-card-link {
  text-decoration: none;
  display: block;
}


.pokemon-card {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2); 
  z-index: 1; 
  height: 100%;
}

.pokemon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(8px);
  z-index: -1;
  opacity: 0.9;
}

.pokemon-card:hover {
  transform: translateY(-8px) rotate(-1deg);
  box-shadow: 0 18px 45px rgba(0,0,0,0.25);
}

.image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.pokemon-img {
  max-height: 120px;
  filter: drop-shadow(0 8px 10px rgba(0,0,0,0.3));
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.pokemon-card:hover .pokemon-img {
  transform: scale(1.15) rotate(5deg);
}

.content {
  text-align: center;
  position: relative; 
  z-index: 2;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.name {
  font-size: 1.3rem; 
  font-weight: 800;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.3); 
}
.id {
  opacity: 0.85;
  font-weight: 500;
}
.types {
  margin: 0.5rem 0;
}
.type-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50px;
  padding: 0.2rem 0.6rem;
  margin: 0 0.2rem;
  text-transform: capitalize;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.desc {
  font-size: 0.85rem;
  margin: 0.5rem 0 1rem;
  color: rgba(0, 0, 0, 0.9);
  min-height: 2.5em;
  flex-grow: 1; 
}


.btn-view {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: #fff;
  padding: 0.5rem 1.25rem; 
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease, transform 0.2s ease;
  align-self: center; 
}
.btn-view:hover {
  background: rgba(255,255,255,0.35);
  transform: scale(1.05); 
}

.fire { background: linear-gradient(135deg, #f7797d, #FBD786); }
.water { background: linear-gradient(135deg, #43cea2, #185a9d); }
.grass { background: linear-gradient(135deg, #56ab2f, #a8e063); }
.electric { background: linear-gradient(135deg, #f7971e, #ffd200); }
.ice { background: linear-gradient(135deg, #83a4d4, #b6fbff); }
.fighting { background: linear-gradient(135deg, #cb356b, #bd3f32); }
.poison { background: linear-gradient(135deg, #6a11cb, #2575fc); }
.ground { background: linear-gradient(135deg, #eacda3, #d6ae7b); }
.flying { background: linear-gradient(135deg, #89f7fe, #66a6ff); }
.psychic { background: linear-gradient(135deg, #ff6a88, #ff99ac); }
.bug { background: linear-gradient(135deg, #76b852, #8DC26F); }
.rock { background: linear-gradient(135deg, #757f9a, #d7dde8); }
.ghost { background: linear-gradient(135deg, #42275a, #734b6d); }
.dragon { background: linear-gradient(135deg, #20002c, #cbb4d4); }
.dark { background: linear-gradient(135deg, #232526, #414345); }
.steel { background: linear-gradient(135deg, #bdc3c7, #2c3e50); }
.fairy { background: linear-gradient(135deg, #fcb69f, #ffdde1); }
.normal { background: linear-gradient(135deg, #ece9e6, #ffffff); }

/* Invert text colors for light backgrounds */
.electric, .ice, .ground, .flying, .rock, .fairy, .normal {
  color: #222;
}
.electric .type-badge, .ice .type-badge, .ground .type-badge, .flying .type-badge, .rock .type-badge, .fairy .type-badge, .normal .type-badge,
.electric .btn-view, .ice .btn-view, .ground .btn-view, .flying .btn-view, .rock .btn-view, .fairy .btn-view, .normal .btn-view {
  color: #222;
  background: rgba(0,0,0,0.1);
}
.electric .btn-view:hover, .ice .btn-view:hover, .ground .btn-view:hover, .flying .btn-view:hover, .rock .btn-view:hover, .fairy .btn-view:hover, .normal .btn-view:hover {
  background: rgba(0,0,0,0.2);
}
</style>