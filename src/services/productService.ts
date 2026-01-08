import { supabase } from './supabase';
import type { Product } from '../types';

export const productService = {
	// Получить все товары с пагинацией
	getProducts: async (page: number = 0, limit: number = 20, categoryId?: string) => {
		let query = supabase
			.from('products')
			.select('*, category:categories(*)')
			.order('created_at', { ascending: false })
			.range(page * limit, (page + 1) * limit - 1);

		if (categoryId) {
			query = query.eq('category_id', categoryId);
		}

		const { data, error } = await query;

		if (error) throw error;
		return data as Product[];
	},

	// Получить товар по ID
	getProductById: async (id: string) => {
		const { data, error } = await supabase
			.from('products')
			.select('*, category:categories(*)')
			.eq('id', id)
			.single();

		if (error) throw error;
		return data as Product;
	},

	// Создать товар
	createProduct: async (product: Omit<Product, 'id' | 'created_at'>) => {
		const { data, error } = await supabase
			.from('products')
			.insert([product])
			.select()
			.single();

		if (error) throw error;
		return data as Product;
	},

	// Обновить товар
	updateProduct: async (id: string, product: Partial<Product>) => {
		const { data, error } = await supabase
			.from('products')
			.update(product)
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data as Product;
	},

	// Удалить товар
	deleteProduct: async (id: string) => {
		const { error } = await supabase
			.from('products')
			.delete()
			.eq('id', id);

		if (error) throw error;
	}
};
