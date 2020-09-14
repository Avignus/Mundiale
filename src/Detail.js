import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Progress from 'react-bootstrap/ProgressBar'
import './App.css';
function Detail({match}) { 
    const [pokemonData, setPokemonData] = useState({});
    const [pokemonName, setPokemonName] = useState('');
    const [firstFormData, setFirstFormData] = useState({});
    const [secondFormData] = useState({});
    const [thirdFormData, setThirdFormData] = useState({});
    const [firstFormReturned, setFirstFormReturned] = useState(false);
    const [thirdFormReturned, setThirdFormReturned] = useState(false);
    const [statusLabelArray, setStatusLabelArray] = useState([]);
    const [statusArray, setStatusArray] = useState([]);
    const [listOfSecondEvolutionNames, setSecondEvolutionNames] = useState([]);
    const [secondEvolutionIds, setSecondEvolutionIds] = useState([]);
    const [types, setTypes] = useState([]);
    useEffect(() => {
        fetchItem();
    }, [])

    const getPokemonNames = (pokemon) => {
        let list = [];
        pokemon.map(pokemon => (
            list.push(pokemon.name)
            
            ))
        setSecondEvolutionNames(list);
    }
    
    const getSecondEvolutionIds = (pokemon) => {
        let listOfIds = [];
        pokemon.map(pokemon => ( 
            listOfIds.push(pokemon.id)
        ))
        setSecondEvolutionIds(listOfIds);
    }

    const renderImages = () => {
        if(secondEvolutionIds.length === 0) {
            return null;
        }
        return (
                <ul style={{paddingTop: 10}}>
                    {secondEvolutionIds.map(item => (
                        <li className="row d-flex align-items-center justify-content-center" style={{listStyle: "none", height: '100%'}}>
                            <img style={{height: 50, backgroundColor: 'transparent'}} src={`https://pokeres.bastionbot.org/images/pokemon/${item}.png`}/>
                        </li>
                    ))}
                </ul>
            )
    }
    const getFormattedName = (name) => {
        const formatted = name.split(" ").map(i => (i[0] ?? "").toUpperCase() + i.slice(1).toLowerCase()).join(" ")
        return formatted
    }
    const renderNames = () => {
        if(listOfSecondEvolutionNames.length === 0) {
            return null;
        }
        return (
            <ul style={{width: '93%'}}>
                {listOfSecondEvolutionNames.map(item => (
                    <li className="row d-flex align-items-center justify-content-center" style={{fontFamily: 'inherit', backgroundColor: 'transparent', listStyle: 'none', height: '100%'}}>
                        <span style={{height: 50, backgroundColor: 'transparent'}}>{getFormattedName(item)}</span>
                    </li>
                ))}
            </ul>
        )
    }
    const renderStatusLabels = () => {
        console.log(statusLabelArray);
        if(statusLabelArray.length === 0) {
            return null;
        }
        return (
            <ul className="row d-flex justify-content-center" style={{width: 120, textAlign: 'left', paddingTop: 10}}>
                {statusLabelArray.map(item => (
                    <div>
                        <li className="row d-flex justify-content-center align-items-center border-bottom border-top border-left" style={{listStyle: 'none', backgroundColor: 'transparent', height: 50, width: 92}}>
                            <span style={{fontSize: 11, fontFamily: 'Consolas'}}>{item.toUpperCase()}</span>
                        </li>

                    </div>
                ))}
            </ul>
        )
    }
    const renderStatus = () => {
        console.log(statusLabelArray);
        if(statusArray.length === 0) {
            return null;
        }
        return (
            
            <ul className="row d-flex justify-content-start align-items-center" style={{width: '100%', textAlign: 'left', paddingTop: 10}}>
                {statusArray.map(item => (
                    
                    <li className="row d-flex align-items-center justify-content-center border" style={{listStyle: 'none', backgroundColor: 'transparent', height: 50}}>
                        <Progress style={{width: 50, height: 10}} variant={decideStyle(statusLabelArray[statusArray.indexOf(item)])} now={item} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        )
    }
    function decideStyle(style) {
        let color = ''
        
        switch(style) {
            case 'hp':
                color = 'success'; 
                return color               
            case 'attack':
                color = 'danger'
                return color               
            case 'defense':
                color = 'danger'
                return color  
            case 'special-attack':
                color = 'info';
                return color;    
            case 'special-defense': 
                color = 'danger'
                return color
            case 'speed': 
                color = 'success'
                return color                
        }
        console.log(style, 'estilo atual');
    }
    const verifySecondForm = async(chain) => {
        const listOfEvolutionPromises = [];
        const listOfEvolutionsReturned = [];
        console.log(chain.chain.evolves_to, 'Verificação da segunda forma');
        if (chain.chain.evolves_to.length > 0) {
            chain.chain.evolves_to.forEach(async function(pokemon) {
                listOfEvolutionPromises.push(fetch(pokemon.species.url).then(response => (response.json())));
            })
            Promise.all(listOfEvolutionPromises)
                .then((response) => response.forEach(function(pokemon) {
                    listOfEvolutionsReturned.push(pokemon);
                }))
                .then(() => getPokemonNames(listOfEvolutionsReturned))
                .then(() => getSecondEvolutionIds(listOfEvolutionsReturned)) 
        }
    }

    const verifyThirdForm = async(chain) => {
        if (chain.chain.evolves_to[0].evolves_to[0] != null) {
            if (chain.chain.evolves_to[0].evolves_to[0].species.name) {
                const getThirdFormData = await fetch(chain.chain.evolves_to[0].evolves_to[0].species.url);
                const thirdFormData = await getThirdFormData.json();
                setThirdFormData(thirdFormData);
                setThirdFormReturned(true);
                console.log(thirdFormData);
            }
        }
    }

    
    const verifySpecie = async(chain) => {
        if (chain.chain.species.name) {
            const getFirstFormData = await fetch(chain.chain.species.url);
            const firstFormData = await getFirstFormData.json();
            setFirstFormData(firstFormData);
            setFirstFormReturned(true);
        } 
        verifySecondForm(chain);
        verifyThirdForm(chain);
    }
    const fetchItem = async() => {
        let labelArray = [];
        let statusArray = [];
        let typesArray = [];
        const fetchItem = await fetch(`https://pokeapi.co/api/v2/pokemon/${match.params.id}`);
        const item = await fetchItem.json();
        setPokemonData(item);
        let formattedPokemonName = item.name.split(" ").map(name => name[0].toUpperCase() + name.slice(1).toLowerCase())
        setPokemonName(formattedPokemonName)
        item.types.map(typeInfo => typesArray.push(typeInfo.type.name));
        item.stats.map(item => {
            labelArray.push(item.stat.name);
            statusArray.push(item.base_stat);
        });
        setStatusLabelArray(labelArray);
        setStatusArray(statusArray);
        setTypes(typesArray);
        const speciesUrl = await item.species.url;
        const species = await fetch(speciesUrl);
        const speciesReturned = await species.json();
        
        if (speciesReturned.evolution_chain) {
            const evolutionChainUrl = await speciesReturned.evolution_chain.url;
            const evolutionChain = await fetch(evolutionChainUrl);
            const evolutionChainReturned = await evolutionChain.json();
            const pokemonEvolutionUrl = await evolutionChainReturned.chain.species.url;
            const evolutionOfPokemon = await fetch(pokemonEvolutionUrl);
            const evolutionReturned = await evolutionOfPokemon.json();
            console.log(evolutionReturned, 'evolução do Pokemon');
            verifySpecie(evolutionChainReturned);
        } else {
            console.log('Não tem evoluções')
        }
    }  

    return(
        <div className="container">
            <div className="col-lg-4 col-md-6 col-sm-8 col-xs-8 offset-xs-0 offset-sm-0 offset-lg-4 card" style={{height: secondEvolutionIds.length > 0 ? 1050 : 850, borderRadius: 40}}>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', borderRadius: 18, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: 50}}>
                    <p className="pokemon-name">
                        {pokemonName}
                    </p>
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', height: 330}}>
                    <div className="col-6">
                        <div className="row d-flex justify-content-center">
                            <img style={{height: 150}} src={`https://pokeres.bastionbot.org/images/pokemon/${pokemonData.id}.png`}/>
                        </div>
                    </div>
                    <div className="col-6" style={{backgroundColor: 'transparent', height: '100%'}}>
                        <div className="row d-flex">
                            <div className="col" style={{backgroundColor: 'transparent'}}>
                                <div className="row justify-content-start" style={{width: '100%'}}>
                                    {renderStatusLabels()}
                                </div>
                            </div>
                            <div className="col" style={{backgroundColor: 'transparent'}}>
                                <div className="row justify-content-start" style={{width: '100%'}}>
                                    {renderStatus()}                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="row d-flex justify-content-center align-items-start border-top">
                    Tipos
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent'}}>
                    <span className={types[0] && types[1] ? `${types[0]} col-6` : `${types[0]} col-12`}>
                        {types[0] ? types[0].toUpperCase() : null}
                    </span>
                    <span className={`${types[1]} col-6`}>
                        {types[1] ? types[1].toUpperCase() : null}
                    </span>
                </div>

                <div className="row d-flex justify-content-center align-items-start border-bottom border-top">
                    Formas
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', borderBottomRightRadius: 18, borderBottomLeftRadius: 18}}>
                        {firstFormReturned ?
                            <div className="row d-flex justify-content-center border-bottom" style={{backgroundColor: 'transparent', width: '100%'}}>
                                <div className="col-12 border-bottom" style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                    Primeira evolução
                                </div>
                                <div className="row d-flex align-items-center justify-content-center" style={{width: '100%', backgroundColor: 'transparent', height: 50, textAlign: 'center'}}>
                                    <div className="col-6 border-right">
                                        <img style={{height: 50}} src={`https://pokeres.bastionbot.org/images/pokemon/${firstFormData.id}.png`}/>
                                    </div>
                                    <div className="col-6" style={{borderWidth: 0.1, borderBottomColor: 'black', backgroundColor: 'transparent', height: 50}}>
                                        <div className="row d-flex justify-content-center align-items-center" style={{height: '100%'}}>
                                            <span style={{borderBottomColor: 'black', borderWidth: 0.7, backgroundColor: 'transparent'}}>
                                                {getFormattedName(firstFormData.name)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : ''
                        }
                        {listOfSecondEvolutionNames.length > 0 ? 
                        <div className="row d-flex justify-content-center align-items-center" style={{width: '100%'}}>
                            <div className="row d-flex align-items-center" style={{width: '100%', backgroundColor: 'transparent', height: 30, textAlign: 'center'}}>
                                <div className="col-12">
                                    <div className="row d-flex justify-content-center align-items-start" style={{backgroundColor: 'transparent'}}>
                                        Possíveis segundas evoluções
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex" style={{backgroundColor: 'transparent', width: '100%', height: 60}}>
                                <div className="col-6 border-top">
                                    <div className="row d-flex justify-content-center align-items-center" >
                                        {renderImages()}
                                    </div>
                                </div>
                                <div className="col-6 border-top" style={{backgroundColor: 'transparent'}}>
                                    <div className="row d-flex justify-content-start align-items-center" style={{height: '100%', width: '100%'}}>
                                        {renderNames()}
                                    </div>
                                </div>
                            </div> 
                        </div>
                         : 
                            <>
                            <div className="row d-flex justify-content-center" style={{backgroundColor: 'transparent', textAlign: 'center'}}>
                                <div className="col-12"></div>
                                <span>Segunda</span>                
                            </div>
                            <div className="row d-flex justify-content-center" style={{backgroundColor: 'transparent', textAlign: 'center'}}>                    
                                <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${secondFormData.id}.png`}/> 
                            </div>
                            </>
                            }
                        {/* {secondFormReturned ? 

                        : ''
                        } */}
                        

                        {thirdFormReturned ?
                        <div className="row d-flex justify-content-center" style={{backgroundColor: 'transparent', textAlign: 'center', width: '100%', paddingTop: 20}}>
                            <div className="col-12 border-bottom">
                                <span>Terceira evolução</span>
                            </div>
                            <div className="row d-flex border-bottom" style={{backgroundColor: 'transparent', height: '100%', width: '100%'}}>
                                <div className="col-6 border-right">
                                    <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', height: '100%'}}>
                                        <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${thirdFormData.id}.png`}/>
                                    </div>
                                </div>
                                <div className="col-6" style={{backgroundColor: 'transparent'}}>
                                    <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'transparent', height: '100%'}}>
                                        <span>{getFormattedName(thirdFormData.name)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                            : ''
                        }
                </div>
                
            </div>
        </div>
    )
}

export default Detail;