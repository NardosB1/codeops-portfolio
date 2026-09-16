import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [user, setUser] = useState(null);

function signIn(name) {
    setUser(name);
}

function signOut() {
    setUser(null);
}

const value = { user, isAuthenticated: Boolean(user), signIn, signOut };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be called inside an <AuthProvider>");
}
    return context;
}