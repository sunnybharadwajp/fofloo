import prisma from '@/lib/prisma';

import ProductsFormComponent from './ProductsForm';

const CreateProductPage = async () => {
	const categories = await prisma.category.findMany();

	return (
		<>
			<ProductsFormComponent categories={categories} />
		</>
	);
};

export default CreateProductPage;
