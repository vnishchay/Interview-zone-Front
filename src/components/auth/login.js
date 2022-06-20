import React from "react";
import { useAuth } from "./authContext";
import axios from "axios";
export const Login = () => {
  const { dispatch } = useAuth();
  const initialState = {
    email: "",
    password: "",
    isSubmitting: false,
    errorMessage: null
  };
const [data, setData] = React.useState(initialState);
const handleInputChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };
const handleFormSubmit = event => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null
    });
    axios.post( 'http://localhost:3001/login' ,
      {
        email : data.email,
        password: data.password
      }
    )
      .then(res => {
        console.log(res)
        if (res.statusText === 'OK') {
          return res ; 
        }
        throw res;
      })
      .then(resJson => {
        dispatch({
            type: "LOGIN",
            payload: {token : resJson.data.token , user : "nishchay"}
        })
      })
      .catch(error => {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage: error.message || error.statusText
        });
      });
  };
return (
    <div className="login-container">
      <div >
        <div >
          <form onSubmit={handleFormSubmit}>
            <h1>Login</h1>

			<label htmlFor="email">
              Email Address
              <input
                type="text"
                value={data.email}
                onChange={handleInputChange}
                name="email"
                id="email"
              />
            </label>

			<label htmlFor="password">
              Password
              <input
                type="password"
                value={data.password}
                onChange={handleInputChange}
                name="password"
                id="password"
              />
            </label>

			{data.errorMessage && (
              <span className="form-error">{data.errorMessage}</span>
            )}

           <button disabled={data.isSubmitting}>
              {data.isSubmitting ? (
                "Loading..."
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;