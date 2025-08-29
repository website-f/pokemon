import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    list: [],           
    details: {},       
    overrides: JSON.parse(localStorage.getItem('pokemon_overrides') || '{}'), 
    loading: false,
    error: null
  }),
  actions: {
    
    async fetchList(limit = 100) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        this.list = res.data.results.map(r => {
         
          const m = r.url.match(/\/pokemon\/(\d+)\/?$/)
          const id = m ? Number(m[1]) : null
          const image = id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : ''
          return { id, name: r.name, url: r.url, image }
        })
      } catch (e) {
        console.error(e)
        this.error = 'Could not load Pokémon list.'
      } finally {
        this.loading = false
      }
    },

    
    async fetchDetail(idOrName) {
      const key = String(idOrName)
      if (this.details[key]) return this.details[key]
      this.loading = true
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${key}`)
        const d = res.data
        const detail = {
          id: d.id,
          name: d.name,
          image: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
          types: d.types.map(t => t.type.name),
          abilities: d.abilities.map(a => a.ability.name),
          stats: d.stats.map(s => ({ name: s.stat.name, base: s.base_stat })),
          height: d.height,
          weight: d.weight,
          moves: d.moves.slice(0, 10).map(m => m.move.name),
          base_experience: d.base_experience,
          raw: d
        }
    
        if (this.overrides[detail.id]) {
          Object.assign(detail, this.overrides[detail.id])
        }
        this.details[key] = detail
        return detail
      } catch (e) {
        console.error(e)
        this.error = 'Could not fetch Pokémon details.'
        return null
      } finally {
        this.loading = false
      }
    },

 
    saveOverride(id, payload) {
      this.overrides[id] = { ...(this.overrides[id] || {}), ...payload }
      localStorage.setItem('pokemon_overrides', JSON.stringify(this.overrides))
  
      if (this.details[String(id)]) {
        this.details[String(id)] = { ...this.details[String(id)], ...this.overrides[id] }
      }
    },

    getDisplayName(id, defaultName) {
      const ov = this.overrides[id]
      return (ov && ov.nickname) || defaultName
    },

    getCustomDescription(id) {
      const ov = this.overrides[id]
      return (ov && ov.description) || ''
    }
  }
})
