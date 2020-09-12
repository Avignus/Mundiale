import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
function Detail({match}) { 
    const [pokemonData, setPokemonData] = useState({});
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
                <div>
                    <ul>
                    {secondEvolutionIds.map(item => (
                        <li style={{listStyle: "none"}}>
                            <img style={{height: 50}} src={`https://pokeres.bastionbot.org/images/pokemon/${item}.png`}/>
                        </li>
                    ))}
                    </ul>
                </div>

            
        )
    }
    const renderNames = () => {
        if(listOfSecondEvolutionNames.length === 0) {
            return null;
        }
        return (
            <ul style={{backgroundColor: 'green', height: '100%'}}>
                {listOfSecondEvolutionNames.map(item => (
                    <li style={{backgroundColor: 'pink', height: 50, listStyle: 'none'}}>
                        <p>{item}</p>
                    </li>
                ))}
            </ul>
        )
    }
    const renderStatusLabels = () => {
        if(statusLabelArray.length === 0) {
            return null;
        }
        return (
            <ul>
                {statusLabelArray.map(item => (
                    <li>
                        <p>{item}</p>
                    </li>
                ))}
            </ul>
        )
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
        let pokemonPromise = []
        const fetchItem = await fetch(`https://pokeapi.co/api/v2/pokemon/${match.params.id}`);
        const item = await fetchItem.json();
        setPokemonData(item);
        console.log(item);
        item.stats.forEach(function(stat) {
            setStatusLabelArray(statusLabelArray.push(stat.stat.name));
            setStatusArray(statusArray.push(stat.base_stat));
            console.log(statusLabelArray);
            console.log(statusArray);
        });

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
                    <p style={{fontSize: 40, fontFamily: 'Montserrat'}}>
                        {pokemonData.name}
                    </p>
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'gray', height: 200}}>
                    <div className="col-6">
                        <img style={{height: 150}} src={`https://pokeres.bastionbot.org/images/pokemon/${pokemonData.id}.png`}/>
                    </div>
                    <div className="col-6">status</div>
                </div>
                <div className="row d-flex justify-content-center align-items-start">
                    Formas
                </div>
                <div className="row d-flex justify-content-center align-items-center" style={{backgroundColor: 'pink', height: 250, borderBottomRightRadius: 18, borderBottomLeftRadius: 18}}>
                        {firstFormReturned ?
                            <div className="row d-flex justify-content-center" style={{backgroundColor: 'yellow', width: '100%'}}>
                                <div className="col-12" style={{backgroundColor: 'blue', textAlign: 'center'}}>
                                    Primeira
                                </div>
                                <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${firstFormData.id}.png`}/>
                            </div>
                        : ''
                        }
                        {listOfSecondEvolutionNames.length > 0 ? 
                        <div className="row d-flex justify-content-center" style={{width: '100%'}}>
                            <div className="row d-flex align-items-center" style={{width: '100%', backgroundColor: 'green', height: 50, textAlign: 'center'}}>
                                <div className="col-12">
                                    Possíveis segundas evoluções
                                </div>
                            </div>
                            <div className="row d-flex" style={{backgroundColor: 'purple', height: '100%', width: '100%'}}>
                                <div className="col-6">
                                    {renderImages()}
                                </div>
                                <div className="col-6">
                                    {renderNames()}
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
                                    <span>Terceira</span>
                                </div>
                                <div className="col-12">
                                    <img style={{height: 100}} src={`https://pokeres.bastionbot.org/images/pokemon/${thirdFormData.id}.png`}/>
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