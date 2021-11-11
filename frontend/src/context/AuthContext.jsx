
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();
export default AuthContext;

const getTokens = () => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
        try {
            return JSON.parse(tokens);
        }
        catch(error) {
            return null;
        }
    }
    else {
        return null;
    }
}

const getUser = () => {
    const tokens = getTokens();
    if (tokens) {
        try {
            return jwtDecode(JSON.stringify(tokens));
        }
        catch(error) {
            return null;
        }
    }
    else {
        return null;
    }
}

const checkLogged = () => {
    return getTokens() ? true : false;
}

export const AuthProvider = ({ children }) => {

    const [tokens, setTokens] = useState(() => getTokens());
    const [user, setUser] = useState(() => getUser());
    const [isLogged, setIsLogged] = useState(() => checkLogged());
    const history = useHistory();

    const logIn = async (event) => {
        event.preventDefault();
        const userData = { email: event.target.email.value, password: event.target.password.value }

        const response = await fetch("http://localhost:8000/api/v1/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })

        const returnedTokens = await response.json();

        if (response.status === 200) {
            const returnedUser = jwtDecode(returnedTokens.access);
            setTokens(returnedTokens);
            setUser(returnedUser);
            setIsLogged(true);
            localStorage.setItem("tokens", JSON.stringify(returnedTokens));
            history.push("/");
        }
        else {
            alert(`Email: ${returnedTokens.email}\nPassword: ${returnedTokens.password}`);
        }
    }

    const logOut = () => {
        setTokens(null);
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("tokens");
        history.push("/login");
    }

    const updateTokens = async () => {
        let refreshToken;
        try {
            refreshToken = JSON.stringify(tokens.refresh);
            jwtDecode(refreshToken);
        }
        catch(error) {
            console.log(error.message);
            return logOut();
        }
        const response = await fetch("http://localhost:8000/api/v1/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: refreshToken
        })

        const returnedTokens = await response.json();

        if (response.status === 200) {
            const returnedUser = jwtDecode(returnedTokens.access);
            setTokens(returnedTokens);
            setUser(returnedUser);
            setIsLogged(true);
            localStorage.setItem("tokens", JSON.stringify(returnedTokens));
        }
        else {
            logOut();
        }
    }

    const accessTokenIsValid = () => {
        
        if (user) {
            const expiresAt = new Date(user.exp * 1000);
            const curDate = new Date();
            if (curDate >= expiresAt - 86400) {
                return false;
            }
            else if (curDate >= expiresAt) {
                return false;
            }
            return true;
        }
        return false;
    }

    useEffect(() => {
        if (isLogged) {
            if (accessTokenIsValid()) {
                const seconds = num => num * 1000
                const interval = setInterval(() => {
                    console.log("Checking if the token is valid!");
                    if (!accessTokenIsValid()) {
                        updateTokens();
                    }
                }, seconds(5));
                return () => clearInterval(interval);
            }
            else {
                updateTokens();
            }
        }
    }, [isLogged]);

    const contextData = { user, tokens, isLogged, logIn, logOut };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}
