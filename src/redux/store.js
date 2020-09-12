import { createStore } from 'redux';
import rootReducer from './reducers/favorites';

export default createStore(rootReducer);