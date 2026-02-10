import { createContext, useContext, useState, useEffect } from 'react';
import StorageService from '../utils/StorageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            // Initialize data on app load
            await StorageService.initializeData();

            // Check if user is already logged in
            const user = StorageService.getCurrentUser();
            if (user) {
                setCurrentUser(user);
            }
            setLoading(false);
        };
        init();
    }, []);

    const register = (userData) => {
        // Check if user already exists
        if (StorageService.userExists(userData.email)) {
            throw new Error('User with this email already exists');
        }

        // Add user to storage
        StorageService.addUser(userData);

        // Auto-login after registration
        const user = StorageService.findUser(userData.email, userData.password);
        StorageService.setCurrentUser(user);
        setCurrentUser(user);

        return user;
    };

    const login = (email, password) => {
        const user = StorageService.findUser(email, password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        StorageService.setCurrentUser(user);
        setCurrentUser(user);

        return user;
    };

    const logout = () => {
        StorageService.clearCurrentUser();
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        register,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
