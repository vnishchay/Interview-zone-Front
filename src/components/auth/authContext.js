import React, { createContext, useContext, useReducer } from "react";
import { Route, Redirect } from "react-router-dom";
const AuthContext = createContext();

// Initialize auth state from localStorage so refreshes keep the user
const getInitialState = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token") || null;
    return {
      isAuthenticated: !!token,
      user: parsedUser,
      token,
    };
  } catch (e) {
    // If parsing fails, clear possibly corrupted storage and start fresh
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // Persist user as JSON and token as string
      try {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      } catch (e) {
        // Fallback: store as string
        localStorage.setItem("user", String(action.payload.user));
      }
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
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
  const [state, dispatch] = useReducer(reducer, getInitialState());
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
