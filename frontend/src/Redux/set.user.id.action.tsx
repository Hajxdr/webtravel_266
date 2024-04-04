// actions.ts
export const SET_USER_ID = 'SET_USER_ID';

export const setUserId = (userId: number) => ({
    type: SET_USER_ID,
    payload: userId,
});
