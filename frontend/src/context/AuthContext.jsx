
import { createContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

const getAccessToken = () => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) return JSON.parse(tokens);
    return null;
}

const getUser = () => {
    const tokens = getAccessToken();
    if (tokens) return jwtDecode(JSON.stringify(tokens));
    return null;
}

export const AuthProvider = ({ children }) => {

    const [tokens, setTokens] = useState(() => getAccessToken());
    const [user, setUser] = useState(() => getUser());
    const history = useHistory();

    const logIn = async (event) => {
        event.preventDefault();
        const userData = { email: event.target.email.value, password: event.target.password.value }

        const response = await fetch("http://localhost:8000/api/v1/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })

        const data = await response.json();

        if (response.status === 200) {
            setTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("tokens", JSON.stringify(data));
            history.push("/home");
        }
        else {
            alert(`Email: ${data.email}\nPassword: ${data.password}`);
        }
    }

    const logOut = () => {
        setTokens(null);
        setUser(null);
        localStorage.removeItem("tokens");
        history.push("/login");
    }

    const contextData = { user, tokens, logIn, logOut }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}
