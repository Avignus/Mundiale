import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Progress from 'react-bootstrap/ProgressBar'
import './App.css';
function Detail({match}) { 
    const [pokemonData, setPokemonData] = useState({});
    const [pokemonName, setPokemonName] = useState('');
    const [firstFormData, setFirstFormData] = useState({});
    const [secondFormData, setSecondFormData] = useState({});
    const [thirdFormData, setThirdFormData] = useState({});
    const [firstFormReturned, setFirstFormReturned] = useState(false);
    const [secondFormReturned, setSecondFormReturned] = useState(false);
    const [thirdFormReturned, setThirdFormReturned] = useState(false);
    const [statusLabelArray, setStatusLabelArray] = useState([]);
    const [statusArray, setStatusArray] = useState([]);
    const [listOfEvolutions, setListOfEvolutions] = useState({});
    const [listOfSecondEvolutionNames, setSecondEvolutionNames] = useState([]);
    const [secondEvolutionIds, setSecondEvolutionIds] = useState([]);
    useEffect(() => {
        fetchItem();
        // setPokemonData(fetchItem());
        // console.log(pokemonData);
    }, [])

    const getPokemonUrl = (id) => `https://pokeapi.co/api/v2/pokemon/${id}`;
    const getPokemonNames = (pokemon) => {
        let list = [];
        pokemon.map(pokemon => (
            list.push(pokemon.name)
            
            ))
        setSecondEvolutionNames(list);
        console.log(listOfSecondEvolutionNames);
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
                            <img style={{height: 50, backgroundColor: 'purple'}} src={`https://pokeres.bastionbot.org/images/pokemon/${item}.png`}/>
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
            <ul style={{paddingTop: 10, width: '100%'}}>
                {listOfSecondEvolutionNames.map(item => (
                    <li className="row d-flex border-bottom justify-content-center" style={{fontFamily: 'inherit', paddingTop: 7, backgroundColor: 'pink', height: 50, listStyle: 'none', borderWidth: 0.1, borderBottomColor: 'black'}}>
                        <p>{getFormattedName(item)}</p>
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
            <ul className="row d-flex justify-content-start" style={{width: '100%', textAlign: 'left', paddingTop: 10}}>
                {statusLabelArray.map(item => (
                    <>
                        <li style={{listStyle: 'none', backgroundColor: 'purple', height: 50}}>
                            {item}
                        </li>

                    </>
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
                    
                    <li style={{listStyle: 'none', backgroundColor: 'transparent', height: 50}}>
                        {/* <p>{item}</p> */}
                        <Progress style={{width: 50, height: 10}} variant={decideStyle(statusLabelArray[statusArray.indexOf(item)])} now={item} />

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
                .then(() => setListOfEvolutions(listOfEvolutionsReturned))
                .then(() => getPokemonNames(listOfEvolutionsReturned))
                .then(() => getSecondEvolutionIds(listOfEvolutionsReturned)) 
        }
        // Promises.all(listOfEvolutionsUrl)
        //     .then(response => console)
        // if (chain.chain.evolves_to[0].species.name) {
        //     const getSecondFormData = await fetch(chain.chain.evolves_to[0].species.url);
        //     const secondFormData = await getSecondFormData.json();
        //     setSecondFormData(secondFormData);
        //     setSecondFormReturned(true);
        //     console.log(secondFormData);
        // }
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
        // console.log(chain.chain.species.name, 'Primeira forma');
        // console.log(chain.chain.evolves_to[0].species.name, 'Segunda forma');
        // console.log(chain.chain.evolves_to[0].evolves_to[0].species.name, 'Terceira forma');
        if (chain.chain.species.name) {
            const getFirstFormData = await fetch(chain.chain.species.url);
            const firstFormData = await getFirstFormData.json();
            setFirstFormData(firstFormData);
            setFirstFormReturned(true);
        } 
        verifySecondForm(chain);
        verifyThirdForm(chain);
        // console.log(chain.chain.species.name, 'Verificando');
        // if (chain.chain.species.name) {
        //     console.log('Primeira evolução', chain.chain.species.name);
        //     console.log('Url da primeira evolução', chain.chain.species.url);
        //     const evolutionBeforeUrl = chain.chain.species.url;
        //     const evolutionBeforeData = await fetch(evolutionBeforeUrl);
        //     const itemBefore = await evolutionBeforeData.json();
        //     setEvolutionBefore(itemBefore);
        //     console.log(itemBefore, 'Evolução anterior no estado');
        // } else { 
        //     console.log('É bebê');
        // }
        // if (chain.chain.evolves_to[0].evolves_to[0]) {
        //     const evolutionAfterUrl = chain.chain.evolves_to[0].evolves_to[0].species.url;
        //     console.log(evolutionAfterUrl, 'url');
        //     const evolutionAfterData = await fetch(evolutionAfterUrl);
        //     const itemAfter = await evolutionAfterData.json();
        //     setEvolutionAfter(itemAfter);
        //     console.log(itemAfter, 'última evolução')
        // } 
    }
    const verifyEvolutionAfter = async(chain) => {
        console.log(chain.chain.evolves_to[0], 'Verificando motivo de não ter aparecido')
        if (chain.chain.evolves_to[0].evolves_to[0]) {
            console.log('Próxima evolução', chain.chain.evolves_to[0].evolves_to[0].species.name);
            console.log('Url da primeira evolução', chain.chain.evolves_to[0].evolves_to[0].species.url);
            const evolutionAfterUrl = chain.chain.evolves_to[0].evolves_to[0].species.url;
            const evolutionAfterData = await fetch(evolutionAfterUrl);
            const itemAfter = await evolutionAfterData.json();
            // setEvolutionAfter(itemAfter);
            console.log(itemAfter, 'Evolução posterior no estado');
        }

        // if (chain.chain.evolves_to[0].species.name) {
        //     console.log(chain.chain.evolves_to[0].species.name, 'penúltima evolução');
        //     const evolutionBeforeUrl = chain.chain.evolves_to[0].species.url
        //     const evolutionBeforeData = await fetch(evolutionBeforeUrl);
        //     const itemBefore = await evolutionBeforeData.json();
        //     setEvolutionBefore(itemBefore);
        //     console.log(itemBefore, 'penúltima evolução');
        // } else {
        //     console.log('Não tem anterior, portanto é bebê');
        // }
        // if (chain.chain.evolves_from[0].length > 0) {
        //     const evolutionBeforeUrl = chain.chain.evolves_from[0].species.url;
        //     const evolutionBeforeData = await fetch(evolutionBeforeUrl);
        //     const itemBefore = await evolutionBeforeData.json();
        //     setEvolutionBefore(itemBefore);
        // }

    }
    const fetchItem = async() => {
        let labelArray = [];
        let statusArray = [];
        let pokemonPromise = []
        const fetchItem = await fetch(`https://pokeapi.co/api/v2/pokemon/${match.params.id}`);
        const item = await fetchItem.json();
        setPokemonData(item);
        let formattedPokemonName = item.name.split(" ").map(name => name[0].toUpperCase() + name.slice(1).toLowerCase())
        setPokemonName(formattedPokemonName)
        item.stats.map(item => {
            console.log(item, 'item retornado status');
            labelArray.push(item.stat.name);
            statusArray.push(item.base_stat)
            // setStatusLabelArray(statusLabelArray.push(stat.stat.name));
            // setStatusArray(statusArray.push(stat.base_stat));
            // console.log(statusLabelArray, 'etiquetas status');
            // console.log(statusArray);
        });
        setStatusLabelArray(labelArray);
        setStatusArray(statusArray);
        const speciesUrl = await item.species.url;
        const species = await fetch(speciesUrl);
        const speciesReturned = await species.json();
        
        if (speciesReturned.evolution_chain) {
            console.log('Tem evoluções')
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


        // verifyEvolutionBefore(evolutionChainReturned);
        // verifyEvolutionBefore(evolutionChainReturned);
        // console.log(evolutionChainUrl);
        
        // const evolutionAfterUrl = await evolutionChainReturned.chain.evolves_to[0].species.url;
        // const evolutionAfter = await fetch(evolutionAfterUrl);
        // const evolutionAfterReturned = await evolutionAfter.json();
        // const evolutionFromUrl = await evolutionChainReturned.chain.evolves_from[0].species.url;
        // console.log(evolutionFromUrl);
        // setEvolutionAfter(evolutionAfterReturned);

        // console.log(evolutionReturned, 'evolui para');
        // console.log(speciesReturned);
        // setEvolutionBefore(evolutionReturned);
        // console.log(evolution);
        // setPokemonData(fetchSpecie);
        // setPokemonData(item);

        // setDetails(pokemonPromise);
        // console.log(details);
        // const item = await fetchItem.json();
        // const species = await item.species.url;
        // const getPokemonDetail = await fetch(species)
    }  
    // console.log(pokemonData);
    console.log(listOfEvolutions, 'lista')
    console.log(secondEvolutionIds, 'lista IDS');
    return(
        <div className="container">
            <div className="col-lg-4 offset-4">
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'yellow', borderRadius: 18, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: 150}}>
                    <p className="pokemon-name">
                        {pokemonName}
                    </p>
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'gray', height: 330}}>
                    <div className="col-6">
                        <div className="row d-flex justify-content-center">
                            <img style={{height: 150}} src={`https://pokeres.bastionbot.org/images/pokemon/${pokemonData.id}.png`}/>
                        </div>
                    </div>
                    <div className="col-6" style={{backgroundColor: 'purple', height: '100%'}}>
                        <div className="row d-flex">
                            <div className="col" style={{backgroundColor: 'orange'}}>
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
                <div className="row d-flex justify-content-center align-items-start">
                    Formas
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'pink', height: 250, borderBottomRightRadius: 18, borderBottomLeftRadius: 18}}>
                        {firstFormReturned ?
                            <div className="row d-flex justify-content-center" style={{backgroundColor: 'yellow', width: '100%'}}>
                                <div className="col-12" style={{backgroundColor: 'blue', textAlign: 'center'}}>
                                    Primeira evolução
                                </div>
                                <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${firstFormData.id}.png`}/>
                            </div>
                        : ''
                        }
                        {listOfSecondEvolutionNames.length > 0 ? 
                        <div className="row d-flex justify-content-center" style={{width: '100%'}}>
                            <div className="row d-flex align-items-center" style={{width: '100%', backgroundColor: 'transparent', height: 50, textAlign: 'center'}}>
                                <div className="col-12">
                                    Possíveis segundas evoluções
                                </div>
                            </div>
                            <div className="row d-flex" style={{backgroundColor: 'purple', height: '100%', width: '100%'}}>
                                <div className="col-4">
                                    <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'green', height: '100%'}}>
                                        {renderImages()}
                                    </div>
                                </div>
                                <div className="col-6" style={{backgroundColor: 'transparent'}}>
                                    <div className="row d-flex justify-content-start">
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
                        <div className="row d-flex justify-content-center" style={{backgroundColor: 'blue', textAlign: 'center', width: '100%'}}>
                            <div className="col-12">
                                <span>Terceira evolução</span>
                            </div>
                            <div className="row d-flex" style={{backgroundColor: 'purple', height: '100%', width: '100%'}}>
                                <div className="col-6">
                                    <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'green', height: '100%'}}>
                                        <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${thirdFormData.id}.png`}/>
                                    </div>
                                </div>
                                <div className="col-6" style={{backgroundColor: 'green'}}>
                                    <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'orange', height: '100%'}}>
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