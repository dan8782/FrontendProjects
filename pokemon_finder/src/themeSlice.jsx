import { createSlice } from '@reduxjs/toolkit'

export const pokemonsSlice = createSlice({
    name: 'pokemons',
    initialState: {
        pokemons: JSON.parse(localStorage.getItem('pokemons')),
    },
    reducers: {
        setPokemon: (state,action) => {
            state.pokemons = action.payload;
        },
        addPokemon: (state,action) => {
            state.pokemons = [action.payload, ...state.pokemons ];
        },
        deletePokemon: (state,action) => {
            state.pokemons = state.pokemons.filter((pokemon) => pokemon.name !== action.payload);
        },
    }
})

export const { setPokemon,addPokemon,deletePokemon } = pokemonsSlice.actions

export default pokemonsSlice.reducer