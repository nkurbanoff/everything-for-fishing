import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { adminAuth } from '../services/supabase';
import type { AuthUser } from '../types';

interface AuthContextType {
	user: AuthUser | null;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Проверка авторизации при загрузке
		if (adminAuth.isAuthenticated()) {
			const username = import.meta.env.VITE_ADMIN_LOGIN || 'admin';
			setUser({ username, isAuthenticated: true });
		}
		setLoading(false);
	}, []);

	const login = async (username: string, password: string): Promise<boolean> => {
		const success = await adminAuth.login(username, password);
		if (success) {
			adminAuth.setAuthenticated(true);
			setUser({ username, isAuthenticated: true });
			return true;
		}
		return false;
	};

	const logout = () => {
		adminAuth.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
