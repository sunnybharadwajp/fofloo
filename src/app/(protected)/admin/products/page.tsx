import prisma from '@/lib/prisma';
import ProductComponent from './Product';

import Link from 'next/link';
import DeleteButton from './DeleteButton';

const ProductsPage = async () => {
	const products: any = await prisma.product.findMany({
		include: {
			images: true,
			category: true,
		},
	});

	const deleteProduct = async (e: any) => {
		e.preventDefault();
		const id = e.target.id;
		const response = await prisma.product.delete({
			where: {
				id: parseInt(id),
			},
		});
		console.log(response);
	};
	return (
		<div>
			<div className="grid grid-cols-3 gap-4">
				{products.map((product: any) => (
					<div className="product-wrapper">
						<Link href={`/admin/products/${product.sku}/edit`} key={product.id}>
							<ProductComponent product={product} key={product.id} />
						</Link>
						<DeleteButton id={product.id} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductsPage;
