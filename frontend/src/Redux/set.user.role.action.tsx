export const SET_USER_ROLE = 'SET_USER_ROLE';

export const setUserRole = (userRole: string) => ({
    type: SET_USER_ROLE,
    payload: userRole,
});
