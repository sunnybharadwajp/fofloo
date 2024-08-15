'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const ProductComponent = ({ product }: any) => {
	const coverImageUrl = product.images[product.coverIndex].url;
	return (
		<div>
			<Card>
				<img src={coverImageUrl} alt="" />
				<CardHeader>
					<CardTitle>{product.name}</CardTitle>
					<CardDescription>{product.category.name}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-lg">Rs. {product.price}</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductComponent;
