import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { validateRequest } from '@/lib/auth/validate_request';

export default async function AdminDashboardPage() {
	const { user } = await validateRequest();
	return (
		<div>
			{user ? (
				<>
					<Link className="link normal mr-4" href="/admin/products">
						Browse Products
					</Link>
					<Link className="link normal" href="/admin/products/create">
						Add new Product
					</Link>
				</>
			) : (
				<>
					<h1>Unauthorised!</h1>
				</>
			)}
		</div>
	);
}
