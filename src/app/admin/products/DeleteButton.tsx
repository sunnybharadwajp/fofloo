'use client';

import prisma from '@/lib/prisma';
import { deleteProductRecord } from '@/actions';

export default function DeleteButton({ id }: any) {
	const deleteProduct = async (e: any) => {
		e.preventDefault();
		const response = await deleteProductRecord(id);
		console.log(response);
	};

	return (
		<>
			<button onClick={deleteProduct}>Delete</button>
		</>
	);
}
