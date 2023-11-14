import React from 'react';
import PokemonCard from './PokemonCard';
import { memo, useCallback, useContext } from 'react';
import {ThemeContext} from './App';

import CardGroup from 'react-bootstrap/ListGroup';
import { Button } from 'react-bootstrap';

const PokemonList = memo(function PokemonList({ pokemons, onDelete }) {
    const isLight = useContext(ThemeContext);

    const handleDelete = useCallback((pokemonName) => {
        console.log(pokemonName)
        onDelete(pokemonName);
    }, [onDelete]);

    return (
        <CardGroup className='m-4'>
           {pokemons.map(pokemon => (
            <div key={pokemon.data.id} className='d-flex justify-content-center align-items-center m-3'>
                <PokemonCard pokemon={pokemon}></PokemonCard>
                <Button  className={`p-1 ${isLight ? 'bg-light text-dark' : 'bg-dark text-white'}`} onClick={() => handleDelete(pokemon.data.name)}>X</Button>
            </div>
        ))} 
        </CardGroup>
    );
});

export default PokemonList;
