import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { getPokemonsState } from './redux/selectors';
import './App.css';
function Pokemon(props){
    useEffect(() => {
        // console.log(props.favorite, 'props')
        // setFavorite(favorite.push(props.favorite))
        // favorite.map(item => {
        //     setFavorite(item.name)
        // })
    }, []);
    if (props.shouldShow == true) {
        return (
            <li className="card-title">
                <button onClick={() => props.setShow(!props.shouldShow)}>{props.nome}</button>
            </li>

        )
    }
    return (
        <p>Aparece</p>
    )
}


export default Pokemon