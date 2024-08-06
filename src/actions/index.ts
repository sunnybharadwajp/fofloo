'use server';

import { z } from 'zod';

import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { generateSku } from '@/lib/utils';

const createProduct = async (formData: any) => {
	let productActive = formData.get('productActive');
	productActive = productActive === 'Active' ? true : false;

	const createdProduct = await prisma.product.create({
		data: {
			name: formData.get('name'),
			description: formData.get('description'),
			price: parseFloat(formData.get('price')),
			stockQuantity: parseInt(formData.get('stockQuantity')),
			categoryId: parseInt(formData.get('categoryId')),
			productActive,
			coverIndex: parseInt(formData.get('coverImageIndex')),
			sku: 'TEMP_SKU',
		},
	});

	let imageIds: number[] = [];

	let imageUrls = JSON.parse(formData.get('imgUrls'));
	imageUrls.forEach(async (url: string) => {
		let createdImage = await prisma.image.create({
			data: {
				url: url,
				productId: createdProduct.id,
			},
		});
		imageIds.push(createdImage.id);
	});

	const sku = generateSku(createdProduct.id);

	let dbResponse = await prisma.product.update({
		where: { id: createdProduct.id },
		data: {
			images: {
				connect: imageIds.map((id) => ({ id })),
			},
			sku,
		},
	});

	console.log(dbResponse);
	revalidatePath('/admin/products');
	redirect('/admin/products');
};

const updateProductRecord = async (formData: any) => {
	let productActive = formData.get('productActive');
	productActive = productActive === 'Active' ? true : false;

	const updatedProduct = await prisma.product.update({
		where: {
			id: parseInt(formData.get('id')),
		},
		data: {
			name: formData.get('name'),
			description: formData.get('description'),
			price: parseFloat(formData.get('price')),
			stockQuantity: parseInt(formData.get('stockQuantity')),
			categoryId: parseInt(formData.get('categoryId')),
			productActive,
			coverIndex: parseInt(formData.get('coverImageIndex')),
		},
	});

	let imageIds: number[] = [];

	let newImageUrls = JSON.parse(formData.get('newImgUrls'));
	newImageUrls.forEach(async (url: string) => {
		let createdImage = await prisma.image.create({
			data: {
				url: url,
				productId: updatedProduct.id,
			},
		});
		imageIds.push(createdImage.id);
	});

	let dbResponse = await prisma.product.update({
		where: { id: updatedProduct.id },
		data: {
			images: {
				connect: imageIds.map((id) => ({ id })),
			},
		},
	});

	console.log(dbResponse);
	revalidatePath('/admin/products');
	redirect('/admin/products');
};

const deleteProductRecord = async (id: number) => {
	try {
		const images = await prisma.image.findMany({
			where: { id: id },
		});

		images.forEach(async (image) => {
			await deleteImageBlob(image.url);
		});

		await prisma.product.delete({
			where: {
				id: id,
			},
		});
		console.log('Product deleted');
		revalidatePath('/admin/products');
		redirect('/admin/products');
	} catch (error) {
		console.error(error);
	}
};

const createImage = async (formData: any) => {
	const file: any = formData.get('image-file');

	if (file.size > 0) {
		const uploadFile = await put(`fofloo/products/${file.name}`, file, {
			access: 'public',
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});

		return {
			url: uploadFile.url,
		};
	} else {
		throw new Error();
	}
};

const deleteImageBlob = async (url: any) => {
	try {
		const response = await del(url.toString(), {
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});
	} catch (error) {
		console.error(error);
	}
};

export { createProduct, updateProductRecord, deleteProductRecord, createImage, deleteImageBlob };
