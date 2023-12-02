import Auth from './pages/login/login'
import RegistrationForm from './pages/login/Signup'
import NavPage from './pages/VacanciesPage';
import EmployerRegistrationForm from './pages/login/SignupEmployer'

import authProvider from './AuthProvider';
import {
    redirect,
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            return { user: authProvider.email };
        },
        Component: Auth,
    },
    {
        path: "/signupEmployer",
        Component: EmployerRegistrationForm,
    },
    {
        path: "/signup",
        Component: RegistrationForm,
    },
    {
        path: "/vacancies",
        loader: protectedLoader,
        Component: NavPage,
    },
    {
        path: "/logout",
        loader: logoutLoader,
    },
]);

async function protectedLoader() {
    if (!await authProvider.isAuth()) {
        return redirect("/");
    } else {
        return null;
    }
}

function logoutLoader() {
    authProvider.signout();
    return redirect("/");
}

export default router;