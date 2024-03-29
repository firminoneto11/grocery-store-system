
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";
import swal from 'sweetalert';

const AuthContext = createContext();
export default AuthContext;

const getTokens = () => {
    const tokens = localStorage.getItem("tokens");
    if (tokens) {
        try {
            return JSON.parse(tokens);
        }
        catch (error) {
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
        catch (error) {
            return null;
        }
    }
    else {
        return null;
    }
}

export const AuthProvider = ({ children }) => {

    const [tokens, setTokens] = useState(() => getTokens());
    const [user, setUser] = useState(() => getUser());
    const [isLogged, setIsLogged] = useState(user ? true : false);
    const history = useHistory();

    const logIn = async (event) => {
        event.preventDefault();
        const userData = { email: event.target.email.value, password: event.target.password.value }

        let response;
        try {
            response = await fetch("http://localhost:8000/api/v1/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
        }
        catch (error) {
            swal({
                "title": "Error",
                "icon": "error",
                "text": "Could not get a response from the server."
            });
            return;
        }

        const returnedTokens = await response.json();

        if (response.status === 200) {
            const returnedUser = jwtDecode(returnedTokens.access);
            setTokens(returnedTokens);
            setUser(returnedUser);
            setIsLogged(true);
            localStorage.setItem("tokens", JSON.stringify(returnedTokens));
            history.push("/");
        }
        else if (response.status === 401) {
            swal({
                "title": "Error",
                "icon": "error",
                "text": "Email or password are invalid."
            });
        }
        else {
            swal({
                "title": "Error",
                "icon": "error",
                "text": `Email: ${returnedTokens.email}\nPassword: ${returnedTokens.password}`
            });
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
        let response;
        try {
            JSON.stringify(tokens.refresh);
            jwtDecode(refreshToken);
            response = await fetch("http://localhost:8000/api/v1/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: tokens.refresh })
            })
        }
        catch (error) {
            return logOut();
        }

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
            const expiresAt = user.exp * 1000;  // Time in ms
            const curDate = new Date().getTime()  // Time in ms
            const milisecondsInADay = 86400000;  // Time in ms

            if (curDate >= expiresAt) {
                return false;
            }
            else if (curDate >= expiresAt - milisecondsInADay) {
                return false;
            }

            return true;
        }
        return false;
    }

    useEffect(() => {
        if (isLogged) {
            if (accessTokenIsValid()) {
                const seconds = num => num * 1000;
                const interval = setInterval(() => {
                    if (!accessTokenIsValid()) updateTokens();
                }, seconds(3600));  // Checking every hour if the tokens are valid
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
