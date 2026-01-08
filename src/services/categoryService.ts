import { supabase } from './supabase';
import type { Category } from '../types';

export const categoryService = {
	// Получить все категории
	getCategories: async () => {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.order('name', { ascending: true });

		if (error) throw error;
		return data as Category[];
	},

	// Создать категорию
	createCategory: async (name: string) => {
		const { data, error } = await supabase
			.from('categories')
			.insert([{ name }])
			.select()
			.single();

		if (error) throw error;
		return data as Category;
	}
};
