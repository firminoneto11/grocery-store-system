
import { Route, Redirect } from "react-router-dom";
import { Fragment, useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function PrivateRoute({ ...args }) {
    const { user } = useContext(AuthContext);

    return (
        <Fragment>
            {user && <Route {...args} />}
            {!user && <Redirect to="/login" />}
        </Fragment>
    );
};
