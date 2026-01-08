import { useState } from 'react';

interface ImageCarouselProps {
	images: string[];
	alt: string;
}

export const ImageCarousel = ({ images, alt }: ImageCarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	if (!images || images.length === 0) {
		return (
			<div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
				<span className="text-gray-400">Нет изображения</span>
			</div>
		);
	}

	const goToNext = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const goToPrevious = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	const goToSlide = (index: number, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentIndex(index);
	};

	return (
		<div className="relative group">
			{/* Главное изображение */}
			<img
				src={images[currentIndex]}
				alt={`${alt} - изображение ${currentIndex + 1}`}
				className="w-full h-64 object-cover"
				onError={(e) => {
					e.currentTarget.onerror = null;
					e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
				}}
			/>

			{/* Кнопки навигации (показываются только если больше 1 изображения) */}
			{images.length > 1 && (
				<>
					{/* Предыдущее */}
					<button
						onClick={goToPrevious}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
						aria-label="Предыдущее изображение"
					>
						‹
					</button>

					{/* Следующее */}
					<button
						onClick={goToNext}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
						aria-label="Следующее изображение"
					>
						›
					</button>

					{/* Индикаторы (точки) */}
					<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={(e) => goToSlide(index, e)}
								className={`w-2 h-2 rounded-full transition ${index === currentIndex
										? 'bg-white scale-125'
										: 'bg-white/50 hover:bg-white/75'
									}`}
								aria-label={`Перейти к изображению ${index + 1}`}
							/>
						))}
					</div>

					{/* Счетчик изображений */}
					<div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
						{currentIndex + 1} / {images.length}
					</div>
				</>
			)}
		</div>
	);
};
