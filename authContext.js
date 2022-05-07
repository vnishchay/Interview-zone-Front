import React, { useState, createContext, useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
require('dotenv').config();
const axios = require('axios')
const AuthContext = createContext();
require('dotenv').config()

const url = process.env.REACT_APP_BASE_URL === undefined ? "http://localhost:3001" : process.env.REACT_APP_BASE_URL;

export const AuthProvider = (props) => {
    const auth = Auth();
    return (
        <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export const PrivateRoute = ({ children, ...rest }) => {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.jwt ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};


const Auth = () => {
    const [user, setuser] = useState([]);
    const [jwt, setjwt] = useState([])
    const signIn = async (email, password) => {
        try {
            await axios
                .post(url + "/login", {
                    email: email.current.value,
                    password: password.current.value,
                })
                .then((response) => {
                    if (response.data.statusCode === 200) {
                        setjwt(response.data.token)
                        setuser(response.data)
                    }
                });
        } catch (e) {
            alert("Login Request Failed : 400");
            // }
        }
    }

    const signUp = async (user) => {
        if (
            user.email.current.value === null ||
            user.password.current.value === null
        )
            return;
        try {
            await axios
                .post(url + "/signup", {
                    email: user.email.current.value,
                    password: user.password.current.value,
                }).then((response) => {
                    setjwt(response.data.jwt)
                })
        }
        catch (e) {
            console.error(e);
        };
    }

    const logout = () => {
        setjwt(undefined)
    }

    return {
        jwt,
        user,
        signIn,
        signUp,
        logout
    }
};


export default Auth;
