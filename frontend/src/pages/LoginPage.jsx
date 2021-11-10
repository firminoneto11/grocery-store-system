
import AuthContext from "../context/AuthContext";
import { Fragment } from "react";
import { useContext } from "react";


export default function LoginPage() {

    const { logIn } = useContext(AuthContext);

    return (
        <Fragment>
            <form onSubmit={logIn}>
                <input type="text" name="email" placeholder="Enter your e-mail" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </Fragment>
    );
}
