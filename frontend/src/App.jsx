
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Browser, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

export default function App() {
    return (
        <Browser>
            <AuthProvider>
                <PrivateRoute component={HomePage} path="/" exact />
                <PrivateRoute component={ProductsPage} path="/products" exact />
                <Route component={LoginPage} path="/login" exact />
            </AuthProvider>
        </Browser>
    );
}
