<script lang="ts">
	import { page } from '$app/state';
	import { authStore, DEMO_USERS } from '$lib/stores/authStore';
	import {
		IconSearch,
		IconTagPrice,
		IconShieldCheck,
		IconReceipt,
		IconStore,
		IconPlus,
		IconUserCheck,
		IconChevronDown
	} from '$lib/components/icons';
	import Button from '$lib/components/ui/Button.svelte';

	let { onOpenSubmitModal }: { onOpenSubmitModal?: () => void } = $props();

	let isRoleMenuOpen = $state(false);
	let isMobileNavOpen = $state(false);

	const currentUser = authStore;

	const navItems = [
		{ label: 'Campus Intelligence', href: '/' },
		{ label: 'Price Compare', href: '/compare' },
		{ label: 'Campus Directory', href: '/listings' },
		{ label: 'Transactions', href: '/transactions' },
		{ label: 'Trust Desk', href: '/admin' }
	];

	function handleRoleChange(roleKey: 'student' | 'vendor' | 'admin') {
		authStore.switchRole(roleKey);
		isRoleMenuOpen = false;
	}
</script>

<header class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
	<!-- Top Bar / Campus Context Notice -->
	<div class="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] sm:text-xs">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
			<div class="flex items-center gap-2 overflow-hidden truncate">
				<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
				<span class="font-medium text-white">UNILAG Akoka Campus Pilot:</span>
				<span class="text-slate-300 truncate">Real like-for-like prices across New Hall, CITS, Science & Bariga Gate</span>
			</div>
			<div class="flex items-center gap-3 shrink-0 text-slate-400">
				<span class="hidden md:inline font-mono text-[11px]">Simulated Transactions Active</span>
				<span class="text-slate-600">•</span>
				<span class="text-emerald-400 font-medium">Demo Ready</span>
			</div>
		</div>
	</div>

	<!-- Main Navigation Bar -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 gap-4">
			<!-- Brand Logo -->
			<a href="/" class="flex items-center gap-3 group">
				<div
					class="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-akoka-700 text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm group-hover:scale-105 transition-transform"
				>
					A
				</div>
				<div class="flex flex-col">
					<div class="flex items-center gap-1.5">
						<span class="font-extrabold text-lg text-slate-950 tracking-tight">AKOKA</span>
						<span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
							PILOT
						</span>
					</div>
					<span class="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-tight hidden sm:block">
						Campus Price Intelligence
					</span>
				</div>
			</a>

			<!-- Desktop Navigation Links -->
			<nav class="hidden lg:flex items-center gap-1">
				{#each navItems as item}
					{@const isActive = item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)}
					<a
						href={item.href}
						class="px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 {isActive
							? 'bg-slate-100 text-slate-900 font-bold'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Action Hub (Submit Price + Demo Role Switcher) -->
			<div class="flex items-center gap-2.5">
				<!-- Submit Price Button -->
				<button
					type="button"
					onclick={onOpenSubmitModal}
					class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
				>
					<IconPlus size={15} />
					<span class="hidden sm:inline">Submit Price</span>
					<span class="sm:hidden">Submit</span>
				</button>

				<!-- Interactive Persona Switcher for Hackathon Live Demo -->
				<div class="relative">
					<button
						type="button"
						onclick={() => (isRoleMenuOpen = !isRoleMenuOpen)}
						class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
						title="Switch demo persona (Student / Vendor / Moderator)"
					>
						<span class="w-2 h-2 rounded-full {$currentUser.role === 'student' ? 'bg-sky-500' : $currentUser.role === 'vendor' ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
						<span class="max-w-[105px] truncate font-semibold">{$currentUser.display_name.split(' ')[0]}</span>
						<span class="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
							{$currentUser.role}
						</span>
						<IconChevronDown size={14} class="text-slate-400" />
					</button>

					{#if isRoleMenuOpen}
						<div
							class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-elevated border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1"
						>
							<div class="px-3.5 py-2 border-b border-slate-100 text-[11px] text-slate-600 font-semibold uppercase tracking-wider">
								Switch Demo Persona
							</div>
							<button
								type="button"
								onclick={() => handleRoleChange('student')}
								class="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer {$currentUser.role === 'student' ? 'bg-sky-50/70 font-semibold' : ''}"
							>
								<span class="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
								<div>
									<div class="text-slate-900 font-medium">Chinedu Eze</div>
									<div class="text-slate-600 text-[11px]">Buyer (Systems Engineering Student)</div>
								</div>
							</button>
							<button
								type="button"
								onclick={() => handleRoleChange('vendor')}
								class="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer {$currentUser.role === 'vendor' ? 'bg-amber-50/70 font-semibold' : ''}"
							>
								<span class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
								<div>
									<div class="text-slate-900 font-medium">K-Print Digital Hub</div>
									<div class="text-slate-600 text-[11px]">Vendor (Shop 12 New Hall Complex)</div>
								</div>
							</button>
							<button
								type="button"
								onclick={() => handleRoleChange('admin')}
								class="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition-colors cursor-pointer {$currentUser.role === 'admin' ? 'bg-emerald-50/70 font-semibold' : ''}"
							>
								<span class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
								<div>
									<div class="text-slate-900 font-medium">Trust Desk Moderator</div>
									<div class="text-slate-600 text-[11px]">Admin (Audit & Dispute Resolution)</div>
								</div>
							</button>
						</div>
					{/if}
				</div>

				<!-- Mobile menu toggle -->
				<button
					type="button"
					onclick={() => (isMobileNavOpen = !isMobileNavOpen)}
					class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
					aria-label="Toggle navigation"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if isMobileNavOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation Drawer -->
	{#if isMobileNavOpen}
		<div class="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
			{#each navItems as item}
				{@const isActive = item.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(item.href)}
				<a
					href={item.href}
					onclick={() => (isMobileNavOpen = false)}
					class="block px-3 py-2 rounded-lg text-sm font-semibold {isActive
						? 'bg-slate-100 text-slate-950 font-bold'
						: 'text-slate-600 hover:bg-slate-50'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
	{/if}
</header>
