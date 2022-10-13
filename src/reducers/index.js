import { combineReducers } from 'redux';
import socketReducer from './socketReducer';
import { LoginReducer } from './loginReducer';

export default combineReducers({
    items: socketReducer,
    login:LoginReducer
});