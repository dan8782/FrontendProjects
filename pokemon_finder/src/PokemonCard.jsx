import React from 'react';
import { memo } from 'react';
import { Card } from 'react-bootstrap';

const PokemonCard = memo(({ pokemon }) => {
  return (
    <Card className='w-25 m-auto'>
      <Card.Title>Формы: {pokemon.data.forms.map(form => form.name).join(', ')}</Card.Title>
      <Card.Img src={pokemon.data.sprites.front_default} alt={pokemon.name} />
    </Card>
  );
});

export default PokemonCard;
