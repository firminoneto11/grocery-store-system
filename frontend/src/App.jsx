
import { AuthProvider } from "./context/AuthContext";

export default function App() {
	return (
		<AuthProvider>
			<p>Hello world!</p>
		</AuthProvider>
	);
}
