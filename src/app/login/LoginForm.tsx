'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { login } from '@/actions/user_actions';

export default function LoginForm() {
	return (
		<>
			<form action={login}>
				<Label htmlFor="username">Username</Label>
				<Input name="username" id="username" />
				<br />
				<Label htmlFor="password">Password</Label>
				<Input type="password" name="password" id="password" />
				<br />
				<Button>Continue</Button>
			</form>
		</>
	);
}
