import { combineReducers, legacy_createStore as createStore } from 'redux';
import userReducer from './reducers';

const rootReducer = combineReducers({
    userRole: userReducer,
    userId: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
