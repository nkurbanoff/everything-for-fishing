import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Product, Category } from '../types';
import { productService } from '../services/productService';
import { imageService } from '../services/supabase';
import imageCompression from 'browser-image-compression';

interface ProductFormProps {
	product: Product | null;
	categories: Category[];
	onSuccess: () => void;
	onCancel: () => void;
}

export const ProductForm = ({ product, categories, onSuccess, onCancel }: ProductFormProps) => {
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		price: 0,
		image_url: '',
		images: [] as string[],
		category_id: '',
		in_stock: true,
	});
	const [loading, setLoading] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				description: product.description,
				price: product.price,
				image_url: product.image_url,
				images: product.images || [product.image_url],
				category_id: product.category_id,
				in_stock: product.in_stock,
			});
		}
	}, [product]);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploadingImage(true);
		setError('');

		try {
			const uploadedUrls: string[] = [];

			// Обрабатываем все выбранные файлы
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// Проверка типа файла
				if (!file.type.startsWith('image/')) {
					console.warn('Пропускаем не-изображение:', file.name);
					continue;
				}

				// Опции сжатия изображения
				const options = {
					maxSizeMB: 0.8,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
					fileType: 'image/jpeg'
				};

				// Сжимаем изображение
				const compressedFile = await imageCompression(file, options);

				console.log(`Файл ${i + 1}: ${(file.size / 1024 / 1024).toFixed(2)} МБ → ${(compressedFile.size / 1024 / 1024).toFixed(2)} МБ`);

				// Загружаем сжатое изображение
				const imageUrl = await imageService.uploadImage(compressedFile);
				if (imageUrl) {
					uploadedUrls.push(imageUrl);
				}
			}

			if (uploadedUrls.length > 0) {
				// Добавляем новые URL к существующим
				const newImages = [...formData.images, ...uploadedUrls];
				setFormData({
					...formData,
					images: newImages,
					image_url: newImages[0] // Первое изображение как основное
				});
			} else {
				setError('Не удалось загрузить изображения');
			}
		} catch (err) {
			console.error('Ошибка сжатия/загрузки:', err);
			setError('Ошибка обработки изображений');
		} finally {
			setUploadingImage(false);
		}
	};

	const handleRemoveImage = (index: number) => {
		const newImages = formData.images.filter((_, i) => i !== index);
		setFormData({
			...formData,
			images: newImages,
			image_url: newImages[0] || ''
		});
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError('');

		// Валидация: хотя бы одно изображение
		if (formData.images.length === 0) {
			setError('Добавьте хотя бы одно изображение');
			return;
		}

		setLoading(true);

		try {
			if (product) {
				await productService.updateProduct(product.id, formData);
			} else {
				await productService.createProduct(formData);
			}
			onSuccess();
		} catch (err: any) {
			setError(err.message || 'Ошибка сохранения товара');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
				{product ? 'Редактировать товар' : 'Добавить товар'}
			</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Название
					</label>
					<input
						type="text"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Описание (необязательно)
					</label>
					<textarea
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						rows={4}
						className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
						placeholder="Добавьте описание товара (опционально)"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Цена
						</label>
						<input
							type="number"
							value={formData.price}
							onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							min="0"
							step="0.01"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Категория
						</label>
						<select
							value={formData.category_id}
							onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
							className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
							required
						>
							<option value="">Выберите категорию</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Изображения товара
					</label>

					{/* Превью изображений */}
					{formData.images.length > 0 && (
						<div className="mb-3 flex flex-wrap gap-3">
							{formData.images.map((imageUrl, index) => (
								<div key={index} className="relative group">
									<img
										src={imageUrl}
										alt={`Preview ${index + 1}`}
										className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
									/>
									<button
										type="button"
										onClick={() => handleRemoveImage(index)}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
										aria-label="Удалить изображение"
									>
										×
									</button>
									{index === 0 && (
										<span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
											Главное
										</span>
									)}
								</div>
							))}
						</div>
					)}

					<div className="flex flex-col sm:flex-row gap-3">
						{/* Кнопка загрузки с телефона */}
						<label className="flex-1 cursor-pointer">
							<div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition">
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{uploadingImage ? '📤 Загрузка...' : '📸 Добавить фото'}
								</span>
							</div>
							<input
								type="file"
								accept="image/*"
								capture="environment"
								multiple
								onChange={handleImageUpload}
								className="hidden"
								disabled={uploadingImage}
							/>
						</label>

						{/* Или указать URL */}
						<div className="flex-1">
							<input
								type="url"
								value=""
								onChange={(e) => {
									if (e.target.value) {
										setFormData({
											...formData,
											images: [...formData.images, e.target.value],
											image_url: formData.images[0] || e.target.value
										});
										e.target.value = '';
									}
								}}
								className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
								placeholder="или введите URL"
							/>
						</div>
					</div>

					<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
						Загрузите несколько фото или укажите URL изображений. Первое фото будет главным.
					</p>
				</div>

				<div className="flex items-center">
					<input
						type="checkbox"
						id="in_stock"
						checked={formData.in_stock}
						onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
						className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
					/>
					<label htmlFor="in_stock" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
						В наличии
					</label>
				</div>

				{error && (
					<div className="text-red-500 text-sm">{error}</div>
				)}

				<div className="flex gap-4">
					<button
						type="submit"
						disabled={loading}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
					>
						{loading ? 'Сохранение...' : 'Сохранить'}
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition"
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	);
};
