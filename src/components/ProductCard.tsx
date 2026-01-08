import type { Product } from '../types';
import { ImageCarousel } from './ImageCarousel';

interface ProductCardProps {
	product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	// Используем массив images или fallback на image_url
	const images = product.images && product.images.length > 0
		? product.images
		: [product.image_url];

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
			<div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
				<ImageCarousel images={images} alt={product.name} />
			</div>

			<div className="p-4">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
					{product.name}
				</h3>

				<p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
					{product.description}
				</p>

				<div className="flex items-center justify-between">
					<span className="text-xl font-bold text-blue-600 dark:text-blue-400">
						{product.price.toLocaleString('ru-RU')}
					</span>

					<span className={`px-2 py-1 text-xs font-medium rounded ${product.in_stock
						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
						}`}>
						{product.in_stock ? 'В наличии' : 'Нет в наличии'}
					</span>
				</div>

				{product.category && (
					<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{product.category.name}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
