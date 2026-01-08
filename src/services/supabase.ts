import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin credentials из переменных окружения
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_LOGIN || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export const adminAuth = {
	login: async (username: string, password: string): Promise<boolean> => {
		// Простая проверка логина и пароля
		return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
	},

	logout: () => {
		localStorage.removeItem('admin_auth');
	},

	isAuthenticated: (): boolean => {
		const auth = localStorage.getItem('admin_auth');
		return auth === 'true';
	},

	setAuthenticated: (value: boolean) => {
		if (value) {
			localStorage.setItem('admin_auth', 'true');
		} else {
			localStorage.removeItem('admin_auth');
		}
	}
};

// Image upload service
export const imageService = {
	uploadImage: async (file: File): Promise<string | null> => {
		try {
			const fileExt = file.name.split('.').pop();
			const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
			const filePath = `products/${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from('product-images')
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				console.error('Upload error:', uploadError);
				return null;
			}

			// Получаем публичный URL
			const { data } = supabase.storage
				.from('product-images')
				.getPublicUrl(filePath);

			return data.publicUrl;
		} catch (error) {
			console.error('Error uploading image:', error);
			return null;
		}
	},

	deleteImage: async (imageUrl: string): Promise<boolean> => {
		try {
			// Извлекаем путь из URL
			const urlParts = imageUrl.split('/product-images/');
			if (urlParts.length < 2) return false;

			const filePath = urlParts[1];

			const { error } = await supabase.storage
				.from('product-images')
				.remove([`products/${filePath}`]);

			if (error) {
				console.error('Delete error:', error);
				return false;
			}

			return true;
		} catch (error) {
			console.error('Error deleting image:', error);
			return false;
		}
	}
};
