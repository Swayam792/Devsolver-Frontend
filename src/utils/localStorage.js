const userToken = 'DevSolKey';

export const saveUser = (user) => {
    localStorage.setItem(userToken, JSON.stringify(user));
}

export const loadUser = () => JSON.parse(localStorage.getItem(userToken));

export const removeUser = () => localStorage.removeItem(userToken);