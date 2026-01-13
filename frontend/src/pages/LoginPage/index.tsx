import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // On récupère le dispatch et l'état d'authentification depuis le store
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    // États locaux pour les champs du formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        // Empêche le rechargement de la page
        e.preventDefault();

        // Dispatch et attendre le résultat
        const resultAction = await dispatch(login({ email, password }));

        // Vérifier si l'action a été réussie
        if (login.fulfilled.match(resultAction)) {
            // Rediriger vers la page d'accueil
            navigate("/");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit" disabled={loading}>
                Se connecter
            </button>
            {error && <p>{error}</p>}
        </form>
    );
}
