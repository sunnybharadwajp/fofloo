import prisma from '@/lib/prisma';

import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: any) {
	const categories = await prisma.category.findMany();

	const product: any = await prisma.product.findUnique({
		where: {
			sku: params.sku,
		},
		include: {
			category: true,
			orderItems: true,
			images: true,
		},
	});

	return (
		<>
			<EditProductForm categories={categories} product={product} />
		</>
	);
}
