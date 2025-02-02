import React, { useState, useEffect } from 'react';
import Posts from './Posts';
import Pagination from './Pagination';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { addPokemon } from './redux/actions/actions';
import { getPokemonsState } from './redux/selectors';

const App = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [pokemonNames, setPokemonNames] = useState([]);
  const [suggestions, setSuggestions] = useState('');
  const [text, setText] = useState('');
  const [pokemonId, setPokemonId] = useState('');
  let [pokemonIndex, setPokemonIndex] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [namesAdded, setNamesAdded] = useState([]);
  const handleAddPokemon = (props) => {
    
    getPokemonId(posts, text);
    setText('');
  }

  const handleAddedPokemon = (pokemonArrayObj, searchedPokemonName) => {
    const lowerCasePokemon = searchedPokemonName.toLowerCase()
    pokemonArrayObj.forEach(function(pokemonObj) {
      setPokemonIndex(pokemonIndex += 1);
      if (pokemonObj.name == lowerCasePokemon) {
        setNamesAdded(namesAdded.push(lowerCasePokemon));
        props.addPokemon(pokemonIndex);
        setPokemonIndex(0);
        setNamesAdded(namesAdded.push(lowerCasePokemon));
      }
    })
  }
  const getPokemonId = (pokemonArrayObj, searchedPokemonName) => {
    if (namesAdded.length == 0) {
      handleAddedPokemon(pokemonArrayObj, searchedPokemonName)
    } else if (namesAdded != 0) {
      for (let i = 0; i < namesAdded.length; i++) {
        if (namesAdded[i] == searchedPokemonName) {
          console.log('Não adiciona o pokemon');
        } else {
          handleAddedPokemon(pokemonArrayObj, searchedPokemonName)
        }
      }
    }
  }

  const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;
  
  const fetchPokemon = () => {
    setLoading(true);
    let listNames = [];
    const pokemonPromises = [];
    for (let i = 1; i <= 890; i++) {
      pokemonPromises.push(fetch(getPokemonUrl(i)).then(response => response.json()));
      
    }
    Promise.all(pokemonPromises)

      .then((response) => (setPosts(response), response.forEach(function(pokemon) {
        listNames.push(pokemon.name[0].toUpperCase() + pokemon.name.slice(1).toLowerCase());
      })))
      .then(() => setPokemonNames(listNames))
    setLoading(false); 
  }
  const onTextChanged = (e) => { 
    const value = e.target.value;
    let suggestions = [];
    let formattedPokemon = value.split(" ").map(v => (v[0] ?? "").toUpperCase() + v.slice(1).toLowerCase()).join(" ")
    if (value.length > 0) { 
        const regex = new RegExp(`${value}`, 'i');
        suggestions = pokemonNames.sort().filter(v => regex.test(v))
    }
    setText(formattedPokemon);
    setSuggestions(suggestions);
    
  }
  
  const suggestionSelected = (value) => {
    setSuggestions([]);
    setText(value)
  }

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
        return null;
    }
    return (
        <div className="AutoCompleteText">
          <ul style={{marginTop: -20}}>
            {suggestions.map(item => (
    
                <li style={{fontFamily: 'Montserrat'}} onClick={() => suggestionSelected(item)}>{item}</li>
    
            ))}
          </ul>
        </div>
    )
  }

  
  const getPokemonIdRedirect = (pokemonArrayObj, searchedPokemonName) => {
    let lowerCasePokemon = searchedPokemonName.toLowerCase()
    pokemonArrayObj.forEach(function(pokemonObj) {
      if (pokemonObj.name == lowerCasePokemon) {
        setPokemonIndex(pokemonObj.id);        
        setRedirect(true);

      }
    })
  }


  useEffect(() => {
    fetchPokemon();
  }, []);


  const indexOfLastPost = currentPage * postsPerPage; 
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (redirect) {
    return <Redirect push to={"/pokemon/" + pokemonIndex} /> 
  }

  const headerStyle = {
    display: 'flex',
    flexDirection: 'column', 
    backgroundColor: 'transparent', 
    height: 350, 
    alignItems: 'center',
    borderRadius: 14
  }
  const imageStyle = {
    height: 100
  }

  const buttonStyle = {
    backgroundColor: 'white' , 
    color: 'black', 
    borderRadius: 7, 
    paddingLeft: 10, 
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center', 
    width: 200,
    fontFamily: 'Montserrat'
  }

  return (
      <div className="container">
          <div className="HeaderCard" style={headerStyle}>
            <img style={imageStyle} src={require('./assets/logo.svg')}/>
            <input 
              value={text}
              placeholder="Nome do pokémon"
              style={{fontFamily: 'Montserrat', marginBottom: 20, background: 'white', color: 'black', borderRadius: 7, paddingLeft: 10, textAlign: 'center', width: 200, marginTop: 20}}
              onChange={onTextChanged} 
              type="text"
            />
            <div style={{backgroundColor: 'green', paddingRight: 180}}>
              {renderSuggestions()}
            </div>
            <button style={{fontFamily: 'Montserrat'}} className="btn-detail" style={buttonStyle} onClick={() => getPokemonIdRedirect(posts, text)}>
              Detalhar
            </button>
            <button style={{fontFamily: 'Montserrat'}} className="btn-favorite" style={buttonStyle} onClick={() => handleAddPokemon(props)}>
              Adicionar aos favoritos
            </button>
            <Link to={'/favorites'}>
              <button style={buttonStyle}>
                Ir para favoritos
              </button>
            </Link>
          </div>
          <div style={{height: 150, width: '100%', display: 'flex', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Pagination 
              postsPerPage={postsPerPage} 
              totalPosts={posts.length} 
              paginate={paginate} 
            />
          </div>
          <div>
            <Posts posts={currentPosts} loading={loading}/>
          </div>
      </div>
  );
}

const mapStateToProps = state => {
  const pokemons = getPokemonsState(state);
  
  return { pokemons };   
  
};

export default connect(
  mapStateToProps,
  { addPokemon } 
)(App);
