import React from 'react';
import './App.css';
function Pokemon(props){
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