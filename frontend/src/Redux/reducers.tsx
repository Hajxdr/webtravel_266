import { SET_USER_ROLE } from './set.user.role.action';
import { SET_USER_ID } from './set.user.id.action';

const initialState = {
    userRole: null,
    userId: null,
};

const userReducer = (state = initialState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case SET_USER_ROLE:
            return {
                ...state,
                userRole: action.payload,
            };
        case SET_USER_ID:
            return {
                ...state,
                userId: action.payload,
            };
        default:
            return state;
    }
};

export default userReducer;
