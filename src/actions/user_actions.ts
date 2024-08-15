'use server';

import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';
import { lucia } from '@/lib/auth';
import { validateRequest } from '@/lib/auth/validate_request';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from '@node-rs/argon2';

export async function signup(formData: FormData) {
	const username = formData.get('username');

	if (
		typeof username !== 'string' ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: 'Invalid username',
		};
	}

	const password = formData.get('password');

	if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		return {
			error: 'Invalid password',
		};
	}

	const passwordHash = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});

	const userId = generateIdFromEntropySize(10);

	// Check if username is already used
	const existingUser = await prisma.user.findUnique({
		where: { username: username },
	});

	if (existingUser) {
		return {
			error: 'Username already taken',
		};
	}

	try {
		const dbResponse = await prisma.user.create({
			data: {
				id: userId,
				username: username,
				password_hash: passwordHash,
			},
		});
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred',
		};
	}

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return redirect('/');
}

export async function login(formData: FormData) {
	const username = formData.get('username');
	if (
		typeof username !== 'string' ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: 'Invalid username',
		};
	}
	const password = formData.get('password');
	if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		return {
			error: 'Invalid password',
		};
	}

	// Find the user by username using Prisma
	const existingUser = await prisma.user.findUnique({
		where: {
			username: username.toLowerCase(),
		},
	});

	if (!existingUser) {
		// Same security note as before regarding timing attacks
		return {
			error: 'Incorrect username or password',
		};
	}

	// Verify the password
	const validPassword = await verify(existingUser.password_hash, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	if (!validPassword) {
		return {
			error: 'Incorrect username or password',
		};
	}

	// Create a session using Lucia
	const session = await lucia.createSession(existingUser.id, {});

	// Create and set the session cookie
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Redirect to the home page
	return redirect('/');
}

export async function logout() {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: 'Unauthorized',
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect('/login');
}
