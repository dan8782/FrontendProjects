import store from './redux/store';
import { setUserRole, setUserId } from './redux/themeSlice';
import axios from 'axios';

const authProvider = {
    email: null,
    role: null,
    async signin(email, password) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, { username: email, password }, { withCredentials: true });
            if (response.status === 200) {
                const { user } = response.data;
                this.role = user.role;
                this.email = user.username;
                document.cookie = `userRole=${user.role}; path=/`;
                document.cookie = `userID=${user.id}; path=/`;
                store.dispatch(setUserRole(user.role));
                store.dispatch(setUserId(user.id));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    signout() {
        authProvider.isAuthenticated = false;
        authProvider.email = "";
        authProvider.role = null;
        document.cookie = 'userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        store.dispatch(setUserRole(null));
        authProvider.token = null;
    },

    async isAuth() {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/checktoken`,
                {
                    withCredentials: true,
                }
            );
            if (response.data && response.data.message === 'Protected route') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching protected data:', error);
            return false;
        }
    },
};


export default authProvider;
