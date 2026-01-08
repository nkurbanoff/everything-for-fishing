import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductForm } from '../components/ProductForm';
import { ProductList } from '../components/ProductList';

export const AdminPage = () => {
	const { user, logout, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		if (authLoading) return;

		if (!user) {
			navigate('/login');
			return;
		}
		loadData();
	}, [user, navigate, authLoading]);

	const loadData = async () => {
		try {
			setLoading(true);
			const [productsData, categoriesData] = await Promise.all([
				productService.getProducts(),
				categoryService.getCategories()
			]);
			setProducts(productsData);
			setFilteredProducts(productsData);
			setCategories(categoriesData);
		} catch (error) {
			console.error('Ошибка загрузки данных:', error);
		} finally {
			setLoading(false);
		}
	};

	// Поиск товаров
	useEffect(() => {
		if (searchQuery.trim() === '') {
			setFilteredProducts(products);
		} else {
			const query = searchQuery.toLowerCase();
			const filtered = products.filter(product =>
				product.name.toLowerCase().includes(query) ||
				product.description?.toLowerCase().includes(query)
			);
			setFilteredProducts(filtered);
		}
	}, [searchQuery, products]);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleAddProduct = () => {
		setEditingProduct(null);
		setShowForm(true);
	};

	const handleEditProduct = (product: Product) => {
		setEditingProduct(product);
		setShowForm(true);
	};

	const handleDeleteProduct = async (id: string) => {
		if (confirm('Вы уверены, что хотите удалить этот товар?')) {
			try {
				await productService.deleteProduct(id);
				await loadData();
			} catch (error) {
				console.error('Ошибка удаления товара:', error);
				alert('Не удалось удалить товар');
			}
		}
	};

	const handleFormSuccess = async () => {
		setShowForm(false);
		setEditingProduct(null);
		await loadData();
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="text-xl text-gray-600 dark:text-gray-400">Загрузка...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			<header className="bg-white dark:bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Админ-панель
					</h1>
					<div className="flex items-center gap-4">
						<span className="text-gray-600 dark:text-gray-400">
							{user?.username}
						</span>
						<button
							onClick={handleLogout}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
						>
							Выйти
						</button>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Поиск и кнопка добавления */}
				<div className="mb-6 flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="🔍 Поиск товаров по названию или описанию..."
								className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
									aria-label="Очистить поиск"
								>
									×
								</button>
							)}
						</div>
						{searchQuery && (
							<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
								Найдено: {filteredProducts.length} из {products.length}
							</p>
						)}
					</div>
					<button
						onClick={handleAddProduct}
						className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition whitespace-nowrap"
					>
						+ Добавить товар
					</button>
				</div>

				{showForm && (
					<div className="mb-8">
						<ProductForm
							product={editingProduct}
							categories={categories}
							onSuccess={handleFormSuccess}
							onCancel={() => {
								setShowForm(false);
								setEditingProduct(null);
							}}
						/>
					</div>
				)}

				<ProductList
					products={filteredProducts}
					onEdit={handleEditProduct}
					onDelete={handleDeleteProduct}
				/>
			</main>
		</div>
	);
};
