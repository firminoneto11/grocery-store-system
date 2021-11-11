
import { Route, Redirect } from "react-router-dom";
import { Fragment, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function PrivateRoute({ ...args }) {
    const { isLogged } = useContext(AuthContext);

    return (
        <Fragment>
            {isLogged && <Route {...args} />}
            {!isLogged && <Redirect to="/login" />}
        </Fragment>
    );
};
