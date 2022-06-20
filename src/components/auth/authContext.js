import React, { createContext, useContext ,  useReducer } from "react";
import { Route, Redirect} from "react-router-dom";
require('dotenv').config()
const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem('user', action.payload.user);
      localStorage.setItem('token',action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState); 
  return (
    <AuthContext.Provider value={{state, dispatch}}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


export const PrivateRoute = ({ children, ...rest }) => {
  const {state} = useAuth(); 
  return (
    
    <Route
      {...rest}
      render={({ location }) =>
        state.isAuthenticated ? (
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

