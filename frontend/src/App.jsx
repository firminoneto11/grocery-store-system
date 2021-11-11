
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <PrivateRoute component={HomePage} path="/" exact />
                <Route component={LoginPage} path="/login" exact />
            </AuthProvider>
        </Router>
    );
}
