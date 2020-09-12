import React from 'react';
import App from './App';
import Detail from './Detail';
import Favorites from './Favorites';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


function IndexRouter() { 
    // useEffect(() => {
    //     window.location.reload();
    // }, [Router]);

    return(
        <Router>
            <Switch>
                {/* <Route path ="/" exact component={Home} /> */}
                <Route path="/favorites" component={Favorites} />
                <Route path="/pokemon/:id" component={Detail} />
                <Route path="/" exact component={App} />
            </Switch>
        </Router>
    )
}

// const Home = () => {
//     <div>
//         <h1>Home Page</h1>
//     </div>
// }

export default IndexRouter;