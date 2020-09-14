import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import Favorites from './Favorites';
import Pokemon from './Pokemon';
import { getPokemonsState } from './redux/selectors';
import { removePokemon } from './redux/actions/actions';
import './App.css';
import favorites from './redux/reducers/favorites';
import 'bootstrap/dist/css/bootstrap.min.css';



const PokemonsList = (props) => {
    const [pokemonData, setPokemonData] = useState([]);
    const [favorite, setFavorite] = useState([]);
    const [pokemons, setPokemons] = useState([]);
    const [pokemonNames, setPokemonNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pokemonIndex, setPokemonIndex] = useState(0);
    const [arrayOfBooleans, setArrayOfBooleans] = useState(true);
    const [shouldShow, setShow] = useState([true, false]); 
    useEffect(() => {
        console.log(props);
        // setPokemonData(pokemonData.push(props.pokemons))
        

        // setFavorite(favorite.push(pokemonData))
        // Object.values(pokemonData[0].byIds).map(pokemon => {
        //     setFavorite(favorite.push(pokemon.content));
        //     console.log(favorite);
        // });
        // for (let i = 1; i < pokemonData[0].allIds.length; i++) {
        //     console.log(pokemonData[0].byIds[i - 1], 'iterado pela', i, 'vez');
        // }
        // for (let i = 0; i < pokemonData[0].byIds.length; i++) {
        //     console.log(pokemonData[0].byIds[i]);
        //     console.log('Iterado')
        // }
        // for (let i = 0; i < pokemonData[0].byIds.length; i++) {            
        //     console.log(pokemonData[0].byIds[i].content, 'iterado');
        // }
        tryFetch();
    }, []);
    const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;

    const fetchPokemon = () => {
        setLoading(true);
        let listNames = [];
        const pokemonPromises = [];
        for (let i = 1; i <= favorite.length; i++) {
          pokemonPromises.push(fetch(getPokemonUrl(favorite[i])).then(response => response.json()));
        }
        Promise.all(pokemonPromises)
        .then((response) => (setPokemons(response), response.forEach(function(pokemon) {
          listNames.push(pokemon.name[0].toUpperCase() + pokemon.name.slice(1).toLowerCase());
         
        })))
        .then(() => setPokemonNames(listNames))
        // const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
        // .then(res => setPosts(posts.push(res.data)))
        // .then(() => console.log(posts))
        
        setLoading(false); 
    }

    

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

    function getPokemonId(searchedPokemonIndex) {
        for (let i = 0; i <= favorite.length; i++) {
            console.log(favorite[i]);
            if (favorite[i] == searchedPokemonIndex) { 
                setPokemonIndex(i)
                console.log('pokemon found at', i);
                return favorite[i];
            }
        }
        // pokemonArrayObj.forEach(function(pokemonIndex) {
        //   setPokemonIndex(pokemonIndex += 1);
        //   if (pokemonIndex == index) {
            // console.log('pokemon found at position', pokemonIndex);
            // props.addPokemon(posts[pokemonIndex - 1])
            // console.log(favorite[pokemonIndex - 1], 'found');
            // setPokemonIndex(0);
            // setRedirect(true);
        //   }
        // })
      }
    
    function searchRevert(array, index) { 
        fetchRemove(index, props.pokemons.allIds, props.pokemons.allIds[index])
        let arrFiltered = []
        for (let i = 0; i <= array.length; i++) {
            console.log(i);
            if (i == index) {
                array[i] = !array[i];
                // array.filter(item => item != array[i])
                console.log(array);
                arrFiltered.push(...array)
                setShow(arrFiltered)
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
        
        
            {/* <Pokemon key={`pokemon-${pokemon.id}`} favorite={pokemon} /> */}
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
    // state.allIds.forEach(function(id) {
        
    // });
    
    return { pokemons };   
    
};

export default connect(mapStateToProps, mapDispatchToProps)(PokemonsList)
