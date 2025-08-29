<template>
  <div class="app-container px-3">
    <header class="text-center py-5">
      <h1 class="h1 mb-2 pokemon-title">
        Catch 'em All!
      </h1>
      <small class="text-muted">Explore and collect your favorite Pokémon.</small>
    </header>

    <main>
      <PokemonList />
    </main>
  </div>
</template>

<script setup>
import PokemonList from '../components/PokemonList.vue'
</script>

<style scoped>
.pokemon-title {
  font-family: 'Bangers', cursive; 
  color: #ffde00;
  -webkit-text-stroke: 2px #3b4cca;
}
</style>