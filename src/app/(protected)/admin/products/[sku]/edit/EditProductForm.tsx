'use client';

import { useState } from 'react';
import { createImage, updateProductRecord } from '@/actions';
import UploadListing from '@/components/UploadListing';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function EditProductForm({ categories, product }: any) {
	let [coverImageIndex, setCoverImageIndex] = useState<number>(product.coverIndex);
	let [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	let images = product.images.map((image: any) => image.url);
	let [imgUrls, setImgUrls] = useState<string[]>(images);
	let [newImgUrls, setNewImgUrls] = useState<string[]>([]);

	const uploadImage = async (event: any) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const data = await createImage(formData);
		setImgUrls([...imgUrls, data.url]);
		setNewImgUrls([...newImgUrls, data.url]);
		setIsDialogOpen(false);
	};

	const updateProduct = async (event: any) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		formData.append('newImgUrls', JSON.stringify(newImgUrls));
		formData.append('id', JSON.stringify(product.id));
		formData.append('coverImageIndex', coverImageIndex.toString());
		console.log('Attempting to update product');
		await updateProductRecord(formData);
	};

	return (
		<>
			<form className="inventory-form" onSubmit={(e) => updateProduct(e)}>
				<div className="form-header flex justify-between">
					<h2 className="text-xl font-semibold mb-4">Add a Product</h2>
					<div className="button-group">
						<Button variant="outline" className="mr-4">
							Save
						</Button>
						<Button type="submit">Update Product</Button>
					</div>
				</div>
				<div className="form-items">
					<div className="form-field">
						<Label htmlFor="name">Name</Label>
						<Input type="text" id="name" name="name" defaultValue={product.name} />
					</div>
					<div className="flex ">
						<div className="form-field mr-10">
							<Label htmlFor="categoryId">Category</Label>
							<Select name="categoryId" value={product.categoryId.toString()}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Choose Category" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((category: any) => (
										<SelectItem key={category.id} value={category.id.toString()}>
											{category.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="form-field">
							<Label htmlFor="">Product Status</Label>
							<RadioGroup
								defaultValue={product.productActive ? 'Active' : 'Inactive'}
								name="productActive"
							>
								<div className="flex">
									<div className="radio-group-item flex items-center space-x-2 mr-6 ">
										<RadioGroupItem value="Active" id="option-one" />
										<Label htmlFor="option-one">Active</Label>
									</div>
									<div className="radio-group-item flex items-center space-x-2 mr-6 ">
										<RadioGroupItem value="Inactive" id="option-two" />
										<Label htmlFor="option-two">Inactive</Label>
									</div>
								</div>
							</RadioGroup>
						</div>
					</div>
					<div className="form-field">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							defaultValue={product.description}
						></Textarea>
					</div>
					<div className="form-field">
						<Label htmlFor="price">Price</Label>
						<Input
							type="number"
							id="price"
							name="price"
							step="0.01"
							defaultValue={product.price}
						/>
					</div>
					<div className="form-field">
						<Label htmlFor="stockQuantity">Stock Quantity</Label>
						<Input
							type="number"
							id="stockQuantity"
							name="stockQuantity"
							defaultValue={product.stockQuantity}
						/>
					</div>
				</div>
			</form>

			<div className="inventory-form pb-20">
				<span className="inline-block mr-4">Images</span>

				<Drawer open={isDialogOpen}>
					<DrawerTrigger asChild>
						<Button
							variant="outline"
							onClick={() => {
								setIsDialogOpen(true);
							}}
						>
							Add Image
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<div className="max-w-2xl m-auto text-center">
								<DrawerTitle className="">Upload a new Image</DrawerTitle>
							</div>
							<DrawerDescription></DrawerDescription>
						</DrawerHeader>

						<DrawerFooter>
							<div className="max-w-2xl m-auto text-center">
								<form onSubmit={(event) => uploadImage(event)} className="inventory-form">
									<Input className="mb-6" type="file" name="image-file" />
									<Button type="submit" className="mr-4">
										Upload Image
									</Button>
									<DrawerClose asChild>
										<Button
											variant="outline"
											onClick={() => setIsDialogOpen(!isDialogOpen)}
										>
											Cancel
										</Button>
									</DrawerClose>
								</form>
							</div>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				{imgUrls.map((url, i) => (
					<UploadListing
						key={url}
						url={url}
						coverIndex={coverImageIndex}
						clickHandler={setCoverImageIndex}
						index={i}
					/>
				))}
			</div>
		</>
	);
}
