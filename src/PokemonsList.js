import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import Pokemon from './Pokemon';
import { getPokemonsState } from './redux/selectors';
import { removePokemon } from './redux/actions/actions';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const PokemonsList = (props) => {
    const [favorite, setFavorite] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [arrayOfBooleans, setArrayOfBooleans] = useState(true);
    useEffect(() => {

        tryFetch();
    }, []);
    const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;

    // const fetchPokemon = () => {
    //     setLoading(true);
    //     let listNames = [];
    //     const pokemonPromises = [];
    //     for (let i = 1; i <= favorite.length; i++) {
    //       pokemonPromises.push(fetch(getPokemonUrl(favorite[i])).then(response => response.json()));
    //     }
    //     Promise.all(pokemonPromises)
    //     .then((response) => (setPokemons(response), response.forEach(function(pokemon) {
    //       listNames.push(pokemon.name[0].toUpperCase() + pokemon.name.slice(1).toLowerCase());
         
    //     })))
    //     setLoading(false); 
    // }

    

    const tryFetch = () => {
        props.pokemons.allIds.map(item => (
            setFavorite(favorite.push(item))
        ))
        setLoading(true);
        const pokemonPromises = [];
        favorite.forEach(function(pokemonId) {
            pokemonPromises.push(fetch(getPokemonUrl(pokemonId)).then(response => response.json()));
            console.log(pokemonPromises, 'promessas');
        })
        Promise.all(pokemonPromises).then((response) => setPokemons(response))
        let arr = new Array(favorite.length);
        for (let i = 0; i < arr.length; i++) { 
            arr[i] = true;
        }
        setArrayOfBooleans(arr);
    }
    
    function searchRevert(array, index) { 
        fetchRemove(index, props.pokemons.allIds, props.pokemons.allIds[index])
        let arrFiltered = []
        for (let i = 0; i <= array.length; i++) {
            console.log(i);
            if (i == index) {
                array[i] = !array[i];
                console.log(array);
                arrFiltered.push(...array)
            }
        }
    }

    const fetchRemove = (index, pokemonArray, pokemonId) => {
        props.removePokemon(props.pokemons.allIds[index]);
        console.log(props.pokemons.allIds);
        console.log(props.pokemons.allIds[index]);
        pokemonArray.filter(item => item.id !== pokemonId);
        console.log(pokemonArray);
    }

    const getFormattedName = (name) => {
        const formatted = name.split(" ").map(i => (i[0] ?? "").toUpperCase() + i.slice(1).toLowerCase()).join(" ")
        return formatted
    }

    console.log(favorite, 'favorito')
    return (
    <div>        
        <ul className="row d-flex">
            {pokemons && pokemons.length 
                ? pokemons.map((pokemon, index) => {
                    const types = pokemon.types.map(typeInfo => typeInfo.type.name);
                    console.log(types, 'tipos');
                        if(arrayOfBooleans[index]) {
                            return (
                            <li key={`pokemon-${pokemon.id}`} className={`card ${types[0]} col-lg-4 align-items-center justify-content-start`}>
                                <div className="row d-flex justify-content-end" style={{backgroundColor: 'transparent', width: '100%'}}>
                                    <button style={{fontFamily: 'Montserrat'}} onClick={() => searchRevert(arrayOfBooleans, index)}>
                                        Remover
                                    </button>
                                </div>
                                <img className={`card-image ${types[0]}`} alt={pokemon.name} src={`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`}/>
                                <p>{getFormattedName(pokemon.name)}</p>
                                <span style={{fontFamily: 'Montserrat'}}>
                                    Tipos
                                </span>
                                <div className="row d-flex" style={{backgroundColor: 'transparent', width: '50%'}}>
                                    <span className={types[0] && types[1] ? `${types[0]} col-6` : `${types[0]} col-12`}>
                                        {types[0] ? types[0].toUpperCase() : null}
                                    </span>
                                    <span className={`${types[1]} col-6`}>
                                        {types[1] ? types[1].toUpperCase() : null}
                                    </span>
                                </div>
                                
                                
                            </li>
                            )

                        }
                })
            : "Nenhum pokemon foi adicionado aos favoritos"}
        </ul>

    </div>

    )
}

const mapDispatchToProps = dispatch => {
    console.log(dispatch);
    return {
        removePokemon: id => dispatch(removePokemon(id))
    };
};
const mapStateToProps = state => {
    const pokemons = getPokemonsState(state);
    console.log(pokemons, 'redux retornado');    
    return { pokemons };   
    
};

export default connect(mapStateToProps, mapDispatchToProps)(PokemonsList)
