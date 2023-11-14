import './App.css';
import { createContext,useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import PokemonList from './PokemonList';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux'
import { setPokemon,addPokemon,deletePokemon } from './themeSlice';

import axios from 'axios';

export const ThemeContext = createContext(null);


function App() {
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [isLight, setIsLight] = useState('light');
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchPokemons() {
            try {
                const storedPokemons = localStorage.getItem('pokemons');
                if (storedPokemons) {
                    setPokemons(JSON.parse(storedPokemons));
                  } else {
                    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
                    const first20Pokemons = response.data.results;
                    const pokemonDetailsPromises = first20Pokemons.map(async (pokemon) => {
                      const detailsResponse = await axios.get(pokemon.url);
                      return detailsResponse;
                    });
                    const pokemonDetails = await Promise.all(pokemonDetailsPromises);
                    setPokemons(pokemonDetails);
                    localStorage.setItem('pokemons', JSON.stringify(pokemonDetails));
                    dispatch(setPokemon(pokemonDetails));
                  }
            } catch (error) {
                console.error('Ошибка при получении списка покемонов', error);
            }
        };
        fetchPokemons();
    },[dispatch] );

    async function handleSearch(searchTerm) {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            const newPokemon = response.data;
            if (!pokemons.some(pokemon => pokemon.data.name === newPokemon.name)) {
                setPokemons(prevPokemons => [response, ...prevPokemons]);
                dispatch(addPokemon(newPokemon)); 
                const updatedLocalStorage = JSON.stringify([response,...pokemons]);
                localStorage.setItem('pokemons', updatedLocalStorage);
            } else {
                alert('Такой покемон уже добавлен');
            }
        } catch (error) {
            alert('Такой покемон не найден');
        }
    }

    function handleDelete(pokemonName) {
        setPokemons((prevPokemons) =>
            prevPokemons.filter((pokemon) => pokemon.data.name !== pokemonName)
        );
        const updatedPokemons = pokemons.filter((pokemon) => pokemon.data.name !== pokemonName);
        localStorage.setItem('pokemons', JSON.stringify(updatedPokemons));
        dispatch(deletePokemon(pokemonName))
        if (selectedPokemon && selectedPokemon.data.name === pokemonName) {
            setSelectedPokemon(null);
        }
    }
    function handleChange(){
        setIsLight(!isLight)
    }

    return (
        <ThemeContext.Provider value={isLight}>
                        <div className={`App ${isLight ? 'bg-light text-dark' : 'bg-dark text-white'}`}>
                <div className='header'>
                    <h1 className='header__text'>Pokemon App</h1>
                    <Form className='form'>
                        <Form.Check
                            className='checkbox_mark checkbox_inp shadow-none'
                            type="switch"
                            onChange={handleChange}
                        />
                    </Form>
                </div>
                <SearchBar onSearch={handleSearch} />
                <PokemonList class="mw-50" pokemons={pokemons} onDelete={handleDelete}></PokemonList>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
