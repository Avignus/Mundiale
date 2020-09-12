import { ADD_FAVORITE } from '../actions/actionTypes';
import { REMOVE_FAVORITE } from '../actions/actionTypes';
const initialState = {
    allIds: []
};

export default function(state = initialState, action) {
    switch (action.type) { 
        case ADD_FAVORITE: { 
            return {
                ...state, 
                allIds: [...state.allIds, action.payload.id]
            }
        }
        case REMOVE_FAVORITE: { 
            return {
                ...state,
                allIds: [
                    ...state.allIds.filter(id => id !== action.payload.id)
                ]
            }
        };
        default: 
            return state;
    }
}