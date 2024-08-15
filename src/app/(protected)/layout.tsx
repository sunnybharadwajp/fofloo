import { validateRequest } from '@/lib/auth/validate_request';

export default async function ProtectedRoutes({ children }: { children: React.ReactNode }) {
	const { user } = await validateRequest();

	return (
		<div>
			{user ? (
				<>{children}</>
			) : (
				<>
					<h1>Unauthorised!</h1>
				</>
			)}
		</div>
	);
}
