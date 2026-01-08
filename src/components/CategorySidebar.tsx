import { useEffect } from 'react';
import type { Category } from '../types';

interface CategorySidebarProps {
	isOpen: boolean;
	onClose: () => void;
	categories: Category[];
	selectedCategory: string;
	onSelectCategory: (categoryId: string) => void;
}

export const CategorySidebar = ({
	isOpen,
	onClose,
	categories,
	selectedCategory,
	onSelectCategory
}: CategorySidebarProps) => {
	// Блокировка прокрутки body при открытой панели
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleCategoryClick = (categoryId: string) => {
		onSelectCategory(categoryId);
		onClose();
	};

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">
							Категории
						</h2>
						<button
							onClick={onClose}
							className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
							aria-label="Закрыть меню"
						>
							<svg
								className="w-6 h-6 text-gray-600 dark:text-gray-300"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Categories List */}
					<div className="flex-1 overflow-y-auto p-4">
						<button
							onClick={() => handleCategoryClick('')}
							className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${selectedCategory === ''
									? 'bg-blue-600 text-white'
									: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
						>
							<span className="font-medium">Все товары</span>
						</button>

						{categories.map((category) => (
							<button
								key={category.id}
								onClick={() => handleCategoryClick(category.id)}
								className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition ${selectedCategory === category.id
										? 'bg-blue-600 text-white'
										: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
							>
								<span className="font-medium">{category.name}</span>
							</button>
						))}
					</div>

					{/* Footer Info */}
					<div className="p-4 border-t border-gray-200 dark:border-gray-700">
						<p className="text-sm text-gray-500 dark:text-gray-400 text-center">
							🎣 Рыболовный магазин
						</p>
					</div>
				</div>
			</div>
		</>
	);
};
