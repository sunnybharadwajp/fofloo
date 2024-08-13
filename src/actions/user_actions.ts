'use server';

import prisma from '@/lib/prisma';
import { lucia } from '@/lib/auth';
import { hash } from '@node-rs/argon2';
import { verify } from '@node-rs/argon2';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateIdFromEntropySize } from 'lucia';
import { validateRequest } from '@/lib/auth';

export async function signup(formData: FormData) {
	const username = formData.get('username');
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
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
	const userId = generateIdFromEntropySize(10); // 16 characters long

	console.log('here');
	// TODO: check if username is already used
	const existingUser = await prisma.user.findUnique({
		where: {
			username: username.toLowerCase(),
		},
	});

	if (existingUser) {
		return {
			error: 'Username already exists',
		};
	}

	await prisma.user.create({
		data: {
			email: '',
			username: username,
			password_hash: passwordHash,
		},
	});

	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await lucia.createSession(userId, { expiresAt });
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

	const existingUser = await prisma.user.findUnique({
		where: {
			username: username.toLowerCase(),
		},
	});
	if (!existingUser) {
		return {
			error: 'Incorrect username or password',
		};
	}

	console.log(existingUser);

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
	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const session = await lucia.createSession(existingUser.id, { expiresAt });
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	console.log('login success');
	redirect('/');
	return redirect('/');
}

export async function logout() {
	'use server';
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
