import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AdminDashboardPage = () => {
	return (
		<div>
			<Link className="link normal mr-4" href="/admin/products">
				Browse Products
			</Link>
			<Link className="link normal" href="/admin/products/create">
				Add new Product
			</Link>
		</div>
	);
};

export default AdminDashboardPage;
