<script setup>
</script>

<template>
  <div id="app-root">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg shadow-sm custom-navbar">
      <div class="container app-container">
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
          <img src="/pngegg.png" alt="logo" class="logo" />
          <span class="fw-bold"> Explorer</span>
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu"
                aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokeAPI</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-4">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="py-4 custom-footer">
      <div class="app-container text-center small">
        <span class="text-muted">© 2025 Pokémon Explorer · Built with Vue 3, Pinia & Bootstrap</span>
      </div>
    </footer>
  </div>
</template>

<style>
/* Navbar */
.custom-navbar {
  background: linear-gradient(90deg, #ffcb05, #3b4cca);
}
.custom-navbar .navbar-brand {
  color: #fff !important;
  font-size: 1.2rem;
}
.custom-navbar .nav-link {
  color: #f8f9fa !important;
  margin-left: 1rem;
  transition: color 0.2s ease-in-out;
}
.custom-navbar .nav-link:hover {
  color: #ffcb05 !important;
}
.logo {
  height: 36px;
}

/* Footer */
.custom-footer {
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
}

/* Layout */
#app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1 0 auto;
}
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
