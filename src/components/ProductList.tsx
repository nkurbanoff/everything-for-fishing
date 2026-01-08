import type { Product } from '../types';

interface ProductListProps {
	products: Product[];
	onEdit: (product: Product) => void;
	onDelete: (id: string) => void;
}

export const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
	if (products.length === 0) {
		return (
			<div className="text-center py-12 text-gray-500 dark:text-gray-400">
				Товары отсутствуют
			</div>
		);
	}

	// Получаем первое изображение из массива или fallback на image_url
	const getProductImage = (product: Product) => {
		if (product.images && product.images.length > 0) {
			return product.images[0];
		}
		return product.image_url;
	};

	return (
		<>
			{/* Мобильная версия - карточки */}
			<div className="lg:hidden space-y-4">
				{products.map((product) => (
					<div
						key={product.id}
						className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4"
					>
						{/* Фото */}
						<img
							src={getProductImage(product)}
							alt={product.name}
							className="w-20 h-20 object-cover rounded flex-shrink-0"
							onError={(e) => {
								e.currentTarget.onerror = null;
								e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12"%3ENo%3C/text%3E%3C/svg%3E';
							}}
						/>

						{/* Информация */}
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-gray-900 dark:text-white truncate">
								{product.name}
							</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
								{product.price.toLocaleString('ru-RU')}
							</p>
							<div className="flex items-center gap-2 mt-2">
								<span className={`px-2 py-0.5 text-xs rounded ${product.in_stock
										? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
										: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
									}`}>
									{product.in_stock ? 'В наличии' : 'Нет'}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{product.category?.name}
								</span>
							</div>
						</div>

						{/* Кнопки */}
						<div className="flex flex-col gap-2 flex-shrink-0">
							<button
								onClick={() => onEdit(product)}
								className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition"
								aria-label="Редактировать"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
								</svg>
							</button>
							<button
								onClick={() => onDelete(product.id)}
								className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition"
								aria-label="Удалить"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Десктопная версия - таблица */}
			<div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-900">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Фото
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Название
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Цена
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Категория
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Наличие
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Действия
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
									<td className="px-6 py-4 whitespace-nowrap">
										<img
											src={getProductImage(product)}
											alt={product.name}
											className="h-16 w-16 object-cover rounded"
											onError={(e) => {
												e.currentTarget.onerror = null;
												e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
											}}
										/>
									</td>
									<td className="px-6 py-4">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{product.name}
										</div>
										{product.description && (
											<div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
												{product.description}
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{product.price.toLocaleString('ru-RU')}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="text-sm text-gray-900 dark:text-white">
											{product.category?.name || '-'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.in_stock
												? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
												: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
											}`}>
											{product.in_stock ? 'В наличии' : 'Нет'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
										<button
											onClick={() => onEdit(product)}
											className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
										>
											Изменить
										</button>
										<button
											onClick={() => onDelete(product.id)}
											className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
										>
											Удалить
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};
