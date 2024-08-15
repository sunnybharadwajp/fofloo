import LoginForm from './LoginForm';

export default function LoginPage() {
	return (
		<>
			<div className="form-block max-w-sm mx-auto mt-6">
				<h1 className="text-2xl font-semibold tracking-tight mb-4 ">Sign in</h1>
				<LoginForm />
			</div>
		</>
	);
}
