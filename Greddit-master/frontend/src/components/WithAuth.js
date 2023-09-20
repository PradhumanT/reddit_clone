import React from 'react'
import { Navigate } from 'react-router-dom';

const WithAuth = (Component) => {
    
    const AuthRoute = () => {
        const isAuth = !!localStorage.getItem("token");
        if (isAuth) {
            return <Component />;
        } else {
            return <Navigate to="/auth?mode=signup" />;
        }
    };

    return AuthRoute;
}

export default WithAuth