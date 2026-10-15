import { writable } from 'svelte/store';
import type { User, UserRole } from '../types/models';

export const DEMO_USERS: Record<string, User> = {
	student: {
		id: 'user-stud-1',
		display_name: 'Chinedu Eze',
		email: 'chinedu.eze@live.unilag.edu.ng',
		matric_or_phone: '190407021 (Systems Eng)',
		role: 'student',
		campus_zone: 'new_hall',
		created_at: '2026-09-01T08:00:00Z',
		account_status: 'active'
	},
	vendor: {
		id: 'user-ven-1',
		display_name: 'K-Print Hub (Mr. Kola)',
		email: 'kprint.akoka@gmail.com',
		matric_or_phone: '+234 802 341 9921',
		role: 'vendor',
		campus_zone: 'new_hall',
		created_at: '2026-08-15T10:00:00Z',
		account_status: 'active'
	},
	admin: {
		id: 'user-admin-1',
		display_name: 'Campus Trust Moderator',
		email: 'trust@akoka-commerce.ng',
		matric_or_phone: 'STAFF-TRUST-09',
		role: 'admin',
		campus_zone: 'cits_commercial',
		created_at: '2026-07-01T08:00:00Z',
		account_status: 'active'
	}
};

function createAuthStore() {
	const { subscribe, set } = writable<User>(DEMO_USERS.student);

	return {
		subscribe,
		switchRole: (roleKey: 'student' | 'vendor' | 'admin') => {
			set(DEMO_USERS[roleKey]);
		},
		setUser: (user: User) => set(user)
	};
}

export const authStore = createAuthStore();
