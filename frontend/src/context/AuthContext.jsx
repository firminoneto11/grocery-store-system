
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
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

export const AuthProvider = ({children}) => {

    const [tokens, setTokens] = useState(() => getAccessToken());
    const [user, setUser] = useState(() => getUser());

    const logIn = async () => {

    }

    const logOut = () => {
        setTokens(null);
        setUser(null);
        localStorage.removeItem("tokens");
        useHistory.push("/login");
    }

    useEffect(() => {

    }, [tokens, user]);

    const contextData = { user, tokens, logIn, logOut }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}
