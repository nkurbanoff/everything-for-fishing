import { useState, useEffect, useRef } from 'react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/ProductCard';
import { CategorySidebar } from '../components/CategorySidebar';

export const CatalogPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		loadCategories();
	}, []);

	useEffect(() => {
		setProducts([]);
		setPage(0);
		setHasMore(true);
		loadProducts(true);
	}, [selectedCategory]);

	useEffect(() => {
		if (page > 0) {
			loadProducts(false);
		}
	}, [page]);

	// Infinite scroll observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					setPage((prev) => prev + 1);
				}
			},
			{ threshold: 0.1 }
		);

		const currentTarget = observerTarget.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
		};
	}, [hasMore, loading]);

	const loadCategories = async () => {
		try {
			const data = await categoryService.getCategories();
			setCategories(data);
		} catch (error) {
			console.error('Ошибка загрузки категорий:', error);
		}
	};

	const loadProducts = async (reset: boolean = false) => {
		if (loading) return;

		try {
			setLoading(true);
			const currentPage = reset ? 0 : page;
			const data = await productService.getProducts(
				currentPage,
				20,
				selectedCategory || undefined
			);

			if (data.length === 0) {
				setHasMore(false);
			} else {
				setProducts((prev) => reset || currentPage === 0 ? data : [...prev, ...data]);
			}
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Sidebar для мобильных */}
			<CategorySidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				categories={categories}
				selectedCategory={selectedCategory}
				onSelectCategory={setSelectedCategory}
			/>

			<header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex items-center">
						{/* Кнопка меню (видна только на мобильных) */}
						<button
							onClick={() => setIsSidebarOpen(true)}
							className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition lg:hidden"
							aria-label="Открыть меню"
						>
							<svg
								className="w-6 h-6 text-gray-700 dark:text-gray-300"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>

						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex-1 text-center sm:text-center">
							🎣 Рыболовный магазин
						</h1>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
				{/* Фильтр по категориям (скрыт на мобильных, виден на десктопе) */}
				<div className="mb-8 hidden lg:block">
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedCategory('')}
							className={`px-4 py-2 rounded-lg font-medium transition ${selectedCategory === ''
								? 'bg-blue-600 text-white'
								: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
						>
							Все товары
						</button>
						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`px-4 py-2 rounded-lg font-medium transition ${selectedCategory === category.id
									? 'bg-blue-600 text-white'
									: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
							>
								{category.name}
							</button>
						))}
					</div>
				</div>

				{/* Список товаров */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{loading && (
					<div className="text-center py-8">
						<div className="text-lg text-gray-600 dark:text-gray-400">
							Загрузка...
						</div>
					</div>
				)}

				{!hasMore && products.length > 0 && (
					<div className="text-center py-8 text-gray-500 dark:text-gray-400">
						Все товары загружены
					</div>
				)}

				{products.length === 0 && !loading && (
					<div className="text-center py-12 text-gray-500 dark:text-gray-400">
						Товары не найдены
					</div>
				)}

				{/* Observer target для infinite scroll */}
				<div ref={observerTarget} className="h-10" />
			</div>
		</div>
	);
};
