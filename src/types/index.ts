export interface Category {
	id: string;
	name: string;
	created_at?: string;
}

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image_url: string;
	images?: string[]; // Массив URL изображений
	category_id: string;
	in_stock: boolean;
	created_at?: string;
	category?: Category;
}

export interface AuthUser {
	username: string;
	isAuthenticated: boolean;
}
