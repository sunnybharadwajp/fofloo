import { signup } from '@/actions/user_actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
	return (
		<>
			<div className="form-block max-w-sm mx-auto mt-6">
				<h1 className="text-2xl font-semibold tracking-tight mb-4 ">Create an account</h1>
				<form action={signup}>
					<Label htmlFor="username">Username</Label>
					<Input name="username" id="username" />
					<br />
					<Label htmlFor="password">Password</Label>
					<Input type="password" name="password" id="password" />
					<br />
					<Button>Continue</Button>
				</form>
			</div>
		</>
	);
}
