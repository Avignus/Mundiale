import React from 'react';
import App from './App';
import Detail from './Detail';
import PokemonsList from './PokemonsList';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function IndexRouter() { 
 
    return(
        <Router>
            <Switch>
                <Route path="/favorites" component={PokemonsList} />
                <Route path="/pokemon/:id" component={Detail} />
                <Route path="/" exact component={App} />
            </Switch>
        </Router>
    )
}

export default IndexRouter;