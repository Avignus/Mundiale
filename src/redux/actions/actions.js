import { ADD_FAVORITE, REMOVE_FAVORITE } from './actionTypes';


export const addPokemon = id => ({
    type: ADD_FAVORITE,
    payload: { 
        id: id,
    }
});

export const removePokemon = id => ({
    type: REMOVE_FAVORITE,
    payload: {
        id: id
    }
})