
import { useContext } from "react";
import { Fragment } from "react";
import AuthContext from "../context/AuthContext";

export default function HomePage() {

    const { user, logOut } = useContext(AuthContext);

    const userAtts = [];
    for (let att in user) {
        userAtts.push(user[att]);
    }

    return (
        <Fragment>
            <h1>Hello {user.first_name} {user.last_name}</h1>
            {userAtts.map((el, i) => <p key={i}>{el}</p>)}
            <button onClick={logOut}>Logout</button>
        </Fragment>
    );
}
