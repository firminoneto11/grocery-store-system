
import { useContext } from "react";
import { Fragment } from "react";
import AuthContext from "../context/AuthContext";

export default function HomePage() {

    const { user, logOut } = useContext(AuthContext);

    return (
        <Fragment>
            <h1>Hello {user.first_name} {user.last_name}</h1>
            <button onClick={logOut}>Logout</button>
        </Fragment>
    );
}
