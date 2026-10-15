import type {
	Category,
	VendorProfile,
	Listing,
	PriceObservation,
	Transaction,
	TransactionEvent,
	Review,
	Report
} from '../types/models';

export const SEED_CATEGORIES: Category[] = [
	{
		id: 'cat-print',
		name: 'Printing & Thesis Binding',
		slug: 'printing-binding',
		icon: 'printer',
		description: 'B&W / Color printing, project spiral binding, hardback thesis gold foil stamping',
		unit_definition: 'per A4 page / per copy / per book',
		comparison_rules: [
			'Always normalize to single-sided 70gsm/80gsm A4 paper',
			'Spiral binding (comb) compared separately from hardback embossed binding',
			'Turnaround time impact: same-day vs 24h standard'
		],
		typical_item_specs: [
			'B&W Printing A4 (80gsm, Single-sided)',
			'Full Color Digital Print A4 (High Density)',
			'Final Year Hardcover Thesis Binding (Gold Stamping)',
			'Spiral Comb Binding with Transparent PVC Cover (<100 pages)'
		],
		sample_size: 42
	},
	{
		id: 'cat-repairs',
		name: 'Laptop & Smartphone Repairs',
		slug: 'device-repairs',
		icon: 'cpu',
		description: 'Screen replacement, battery swap, hinge welding, OS recovery and charging ports',
		unit_definition: 'per repair job + diagnostic check',
		comparison_rules: [
			'Compare OEM original screen replacements separately from Grade A copies',
			'Always verify if diagnostic fee is waived upon repair agreement',
			'Warranty period (minimum 14-day warranty included)'
		],
		typical_item_specs: [
			'HP/Dell Laptop Hinge Repair & Top Cover Welding',
			'MacBook / ThinkPad Battery Replacement (OEM Grade)',
			'iPhone Screen Glass + Digitizer Replacement (OLED)',
			'Windows/macOS Clean OS Installation & Academic Software Recovery'
		],
		sample_size: 29
	},
	{
		id: 'cat-tailoring',
		name: 'Tailoring & Alterations',
		slug: 'tailoring-alterations',
		icon: 'scissors',
		description: 'Blazer alterations, trouser slimming, graduation gown adjustments & zipper fixes',
		unit_definition: 'per garment / per alteration',
		comparison_rules: [
			'Simple waist taking-in vs total re-cutting of pants',
			'Lining replacement costs counted separately',
			'Urgent 4-hour rush fee vs 48-hour pickup'
		],
		typical_item_specs: [
			'Trouser Slimming & Length Hemming (Formal Slacks)',
			'Suit / Blazer Sleeve Shortening & Shoulder Adjustments',
			'Graduation Sub-Gown Fit Adjustment & Monogram Embroidery',
			'Jeans Metal Zipper Replacement + Heavy Denim Stitch'
		],
		sample_size: 24
	},
	{
		id: 'cat-laundry',
		name: 'Laundry & Dry Cleaning',
		slug: 'laundry-drycleaning',
		icon: 'sparkles',
		description: 'Wash, steam press, duvet cleaning and white native attire starching',
		unit_definition: 'per bag (5kg) / per 3-piece native outfit / per duvet',
		comparison_rules: [
			'Wash & Fold bulk bag vs individual hand-ironed garments',
			'Heavy bedding / duvets priced per piece',
			'Starching intensity specified (light vs hard starch)'
		],
		typical_item_specs: [
			'Student Weekly Wash & Fold Laundry Bag (up to 6kg)',
			'Agbada & 3-Piece Native Starch & Steam Pressing',
			'King Size Duvet / Blanket Deep Clean & Sanitization',
			'Formal 2-Piece Suit Dry Clean + Dust Cover Packaging'
		],
		sample_size: 31
	},
	{
		id: 'cat-typing',
		name: 'Typing & Data Formatting',
		slug: 'typing-formatting',
		icon: 'file-text',
		description: 'APA/IEEE referencing formatting, questionnaire data entry & questionnaire charts',
		unit_definition: 'per page / per questionnaire sheet',
		comparison_rules: [
			'Pure typing from handwritten notes vs academic formatting/tables',
			'Plagiarism similarity scan report inclusion',
			'Turnaround deadline: overnight vs 3 days'
		],
		typical_item_specs: [
			'Project Chapter Formatting (UNILAG SPGS / Faculty Format)',
			'Questionnaire Data Entry & SPSS Coding (per 50 respondents)',
			'Mathematical & Engineering Equation Typesetting (LaTeX/Word)'
		],
		sample_size: 14
	}
];

export const SEED_VENDORS: VendorProfile[] = [
	{
		id: 'ven-1',
		user_id: 'user-ven-1',
		business_name: 'K-Print Digital Hub',
		tagline: 'Akoka’s fastest thesis printing & spiral binding specialist',
		categories: ['cat-print', 'cat-typing'],
		service_area: 'New Hall Complex & Faculty of Science',
		campus_zone: 'new_hall',
		physical_spot: 'Shop 12, New Hall Shopping Complex (Beside Madam Mango)',
		verification_status: 'vendor_confirmed',
		phone: '+234 802 341 9921',
		whatsapp: '+234 802 341 9921',
		operational_hours: 'Mon – Sat: 8:00 AM – 8:30 PM',
		rating: 4.8,
		review_count: 53,
		completed_transactions_count: 142,
		price_integrity_score: 96,
		avatar_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=80',
		bio: 'Serving UNILAG students for over 6 years. We specialize in crisp high-speed monochrome printing, SPGS-compliant hardbound thesis stamping, and express poster prints.'
	},
	{
		id: 'ven-2',
		user_id: 'user-ven-2',
		business_name: 'Alaba Tech Medic (CITS Annex)',
		tagline: 'Certified laptop hardware repair & component-level soldering',
		categories: ['cat-repairs'],
		service_area: 'CITS, Engineering Quad & Distance Learning Hub',
		campus_zone: 'cits_commercial',
		physical_spot: 'Kiosk 4, CITS Annex Commercial Center, UNILAG',
		verification_status: 'campus_audited',
		phone: '+234 814 772 0019',
		whatsapp: '+234 814 772 0019',
		operational_hours: 'Mon – Fri: 9:00 AM – 6:30 PM',
		rating: 4.7,
		review_count: 38,
		completed_transactions_count: 89,
		price_integrity_score: 91,
		avatar_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80',
		bio: 'Trained technician offering transparent diagnosis for students. No surprise price hikes; every scope and part replacement is documented before screwdriver touches your PC.'
	},
	{
		id: 'ven-3',
		user_id: 'user-ven-3',
		business_name: 'Sisi Akoka Monograms & Fit',
		tagline: 'Bespoke tailoring, fast slacks slimming & urgent zipper fixes',
		categories: ['cat-tailoring'],
		service_area: 'Bariga Gate, St. Finbarr’s Road & Moremi Hall',
		campus_zone: 'bariga_gate',
		physical_spot: '18 St. Finbarr’s College Road (2 mins from UNILAG Gate)',
		verification_status: 'vendor_confirmed',
		phone: '+234 803 559 1234',
		whatsapp: '+234 803 559 1234',
		operational_hours: 'Mon – Sat: 8:30 AM – 7:00 PM',
		rating: 4.9,
		review_count: 41,
		completed_transactions_count: 110,
		price_integrity_score: 98,
		avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
		bio: 'Master tailor with 8+ years experience near UNILAG. We make your thrift finds fit like high fashion and repair zippers within 30 minutes.'
	},
	{
		id: 'ven-4',
		user_id: 'user-ven-4',
		business_name: 'FreshCampus Express Laundromat',
		tagline: 'Same-day student wash, starch & hygienic steam press',
		categories: ['cat-laundry'],
		service_area: 'Fagunwa, Mariere, Moremi & Amina Halls',
		campus_zone: 'fagunwa_mariere',
		physical_spot: 'Behind Mariere Car Park Laundry Depot',
		verification_status: 'unverified',
		phone: '+234 816 880 4321',
		whatsapp: '+234 816 880 4321',
		operational_hours: 'Mon – Sun: 7:00 AM – 9:00 PM',
		rating: 4.2,
		review_count: 19,
		completed_transactions_count: 47,
		price_integrity_score: 83,
		avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
		bio: 'Affordable campus wash and iron service. Note: This provider profile has not been independently audited by campus ambassadors yet.'
	}
];

export const SEED_LISTINGS: Listing[] = [
	{
		id: 'list-101',
		vendor_id: 'ven-1',
		category_id: 'cat-print',
		title: 'Standard Black & White A4 Printing (Double or Single Sided)',
		description: 'High-speed laser printing on crisp 80gsm white paper. Ideal for lecture slides, past questions, and project drafts.',
		price: 35,
		unit: 'per page',
		turnaround_time: '15 - 30 minutes while you wait',
		inclusions: ['80gsm quality bond paper', 'Laser sharpness guarantee', 'Collation and stapling for <50 pages'],
		exclusions: ['Heavy card stock (available at extra ₦50/sheet)', 'Plastic binding combs'],
		availability: 'available',
		updated_at: '2026-10-14T09:30:00Z'
	},
	{
		id: 'list-102',
		vendor_id: 'ven-1',
		category_id: 'cat-print',
		title: 'SPGS Final Year Thesis Hardcover Binding (Gold Foil)',
		description: 'Faculty-approved navy blue or black hardback buckram cover with embossed gold lettering on front and spine.',
		price: 6500,
		unit: 'per hardcopy volume',
		turnaround_time: '24 hours standard (or 6h rush +₦1,500)',
		inclusions: ['Embossed spine & front lettering', 'Acid-free separator sheets', 'Faculty color compliance check'],
		exclusions: ['Page printing cost billed separately', 'CD holder jacket (₦300 extra)'],
		availability: 'available',
		updated_at: '2026-10-13T16:15:00Z'
	},
	{
		id: 'list-103',
		vendor_id: 'ven-2',
		category_id: 'cat-repairs',
		title: 'Laptop Hinge Reconstruction & Chassis Welding',
		description: 'Fix cracked screen hinges, broken casing and stuck joints for HP, Lenovo, Dell and ASUS notebooks without replacing whole casing.',
		price: 12000,
		unit: 'per repair job',
		turnaround_time: '4 to 6 hours',
		inclusions: ['Industrial epoxy welding & reinforcement', 'Screw thread re-anchoring', '30-day hinge tension warranty'],
		exclusions: ['New LCD panel replacement if screen was cracked before handoff', 'Cosmetic paint touchups'],
		availability: 'available',
		updated_at: '2026-10-12T11:00:00Z'
	},
	{
		id: 'list-104',
		vendor_id: 'ven-3',
		category_id: 'cat-tailoring',
		title: 'Formal Trousers Slimming, Tapering & Inseam Hemming',
		description: 'Transform loose or baggy trousers into tailored, sharp modern fit. Preserves original pocket shape and hem lines.',
		price: 1800,
		unit: 'per pair of trousers',
		turnaround_time: 'Same day (3 - 5 hours)',
		inclusions: ['Pre-measurement check', 'Double-lock thread reinforcement', 'Steam pressing of creases before collection'],
		exclusions: ['Replacing broken zipper sliders (₦500 extra)'],
		availability: 'available',
		updated_at: '2026-10-14T14:40:00Z'
	},
	{
		id: 'list-105',
		vendor_id: 'ven-4',
		category_id: 'cat-laundry',
		title: 'Student Weekly Wash & Fold Bag (Up to 6kg)',
		description: 'Hygienic machine wash with fabric softener, tumble dry and neat folding for everyday shirts, jeans, bedsheets and underwear.',
		price: 3500,
		unit: 'per laundry bag (approx 15-18 items)',
		turnaround_time: '24 - 36 hours',
		inclusions: ['Detergent & Downy fabric conditioner', 'Separate light vs dark color load', 'Folded in waterproof bag'],
		exclusions: ['Heavy steam ironing (hand iron available at ₦200/shirt extra)', 'Dry cleaning for blazers'],
		availability: 'busy',
		updated_at: '2026-10-11T18:00:00Z'
	}
];

export const SEED_OBSERVATIONS: PriceObservation[] = [
	{
		id: 'obs-1',
		category_id: 'cat-print',
		item_specification: 'B&W Printing A4 (80gsm, Single-sided)',
		amount: 35,
		unit: 'per page',
		area: 'New Hall Shopping Complex',
		campus_zone: 'new_hall',
		source_type: 'vendor_confirmed',
		observed_at: '2026-10-14T10:00:00Z',
		last_confirmed_at: '2026-10-15T09:00:00Z',
		verification_status: 'verified',
		vendor_id: 'ven-1',
		vendor_name: 'K-Print Digital Hub',
		notes: 'Confirmed directly from printed price board outside shop 12.',
		is_demo_data: true
	},
	{
		id: 'obs-2',
		category_id: 'cat-print',
		item_specification: 'B&W Printing A4 (80gsm, Single-sided)',
		amount: 40,
		unit: 'per page',
		area: 'Faculty of Education Quad',
		campus_zone: 'cits_commercial',
		source_type: 'student_submitted',
		observed_at: '2026-10-13T14:20:00Z',
		last_confirmed_at: '2026-10-14T11:30:00Z',
		verification_status: 'verified',
		notes: 'Student submitted receipt for 30 pages of GST handout.',
		is_demo_data: true
	},
	{
		id: 'obs-3',
		category_id: 'cat-print',
		item_specification: 'B&W Printing A4 (80gsm, Single-sided)',
		amount: 30,
		unit: 'per page',
		area: 'Faculty of Science Basement',
		campus_zone: 'science_eng',
		source_type: 'student_submitted',
		observed_at: '2026-10-12T16:00:00Z',
		last_confirmed_at: '2026-10-13T08:00:00Z',
		verification_status: 'verified',
		notes: 'Bulk discount applied for orders over 100 pages.',
		is_demo_data: true
	},
	{
		id: 'obs-4',
		category_id: 'cat-print',
		item_specification: 'Final Year Hardcover Thesis Binding (Gold Stamping)',
		amount: 6500,
		unit: 'per book',
		area: 'New Hall Complex',
		campus_zone: 'new_hall',
		source_type: 'transaction_linked',
		observed_at: '2026-10-13T11:00:00Z',
		last_confirmed_at: '2026-10-14T15:00:00Z',
		verification_status: 'verified',
		vendor_id: 'ven-1',
		vendor_name: 'K-Print Digital Hub',
		notes: 'Recorded via completed documented transaction #TX-8821.',
		is_demo_data: true
	},
	{
		id: 'obs-5',
		category_id: 'cat-print',
		item_specification: 'Final Year Hardcover Thesis Binding (Gold Stamping)',
		amount: 7000,
		unit: 'per book',
		area: 'Senate Car Park Business Center',
		campus_zone: 'cits_commercial',
		source_type: 'receipt_supported',
		observed_at: '2026-10-10T12:00:00Z',
		last_confirmed_at: '2026-10-12T17:00:00Z',
		verification_status: 'verified',
		notes: 'Receipt attached showing gold lettering and hardboard reinforcement.',
		is_demo_data: true
	},
	{
		id: 'obs-6',
		category_id: 'cat-repairs',
		item_specification: 'HP/Dell Laptop Hinge Repair & Top Cover Welding',
		amount: 12000,
		unit: 'per repair job',
		area: 'CITS Annex Commercial Center',
		campus_zone: 'cits_commercial',
		source_type: 'vendor_confirmed',
		observed_at: '2026-10-14T13:00:00Z',
		last_confirmed_at: '2026-10-15T08:00:00Z',
		verification_status: 'verified',
		vendor_id: 'ven-2',
		vendor_name: 'Alaba Tech Medic (CITS Annex)',
		notes: 'Standard hinge re-seat + industrial epoxy hardening.',
		is_demo_data: true
	},
	{
		id: 'obs-7',
		category_id: 'cat-repairs',
		item_specification: 'HP/Dell Laptop Hinge Repair & Top Cover Welding',
		amount: 14500,
		unit: 'per repair job',
		area: 'Off-campus St. Finbarr’s Junction',
		campus_zone: 'bariga_gate',
		source_type: 'student_submitted',
		observed_at: '2026-10-09T17:00:00Z',
		last_confirmed_at: '2026-10-10T11:00:00Z',
		verification_status: 'verified',
		notes: 'Included replacing 1 missing brass screw thread.',
		is_demo_data: true
	},
	{
		id: 'obs-8',
		category_id: 'cat-tailoring',
		item_specification: 'Trouser Slimming & Length Hemming (Formal Slacks)',
		amount: 1800,
		unit: 'per pair',
		area: 'St. Finbarr’s Axis (Near Bariga Gate)',
		campus_zone: 'bariga_gate',
		source_type: 'vendor_confirmed',
		observed_at: '2026-10-14T15:00:00Z',
		last_confirmed_at: '2026-10-15T09:30:00Z',
		verification_status: 'verified',
		vendor_id: 'ven-3',
		vendor_name: 'Sisi Akoka Monograms & Fit',
		notes: 'Includes tapering calf, inner thigh, and bottom hem press.',
		is_demo_data: true
	},
	{
		id: 'obs-9',
		category_id: 'cat-tailoring',
		item_specification: 'Trouser Slimming & Length Hemming (Formal Slacks)',
		amount: 2000,
		unit: 'per pair',
		area: 'Moremi Hall Kiosk',
		campus_zone: 'moremi_amina',
		source_type: 'student_submitted',
		observed_at: '2026-10-11T12:00:00Z',
		last_confirmed_at: '2026-10-12T14:00:00Z',
		verification_status: 'verified',
		notes: 'Express 2-hour turnaround fee included.',
		is_demo_data: true
	},
	{
		id: 'obs-10',
		category_id: 'cat-typing',
		item_specification: 'Mathematical & Engineering Equation Typesetting (LaTeX/Word)',
		amount: 1500,
		unit: 'per page',
		area: 'Faculty of Engineering Annex',
		campus_zone: 'science_eng',
		source_type: 'student_submitted',
		observed_at: '2026-09-20T10:00:00Z',
		last_confirmed_at: '2026-09-22T10:00:00Z',
		verification_status: 'verified',
		notes: 'Only 1 old observation found for this specific complex spec.',
		is_demo_data: true
	}
];

export const SEED_TRANSACTIONS: Transaction[] = [
	{
		id: 'TX-8821',
		buyer_id: 'user-stud-1',
		buyer_name: 'Chinedu Eze (Dept of Systems Eng)',
		vendor_id: 'ven-1',
		vendor_name: 'K-Print Digital Hub',
		listing_id: 'list-102',
		item_title: 'SPGS Final Year Thesis Hardcover Binding (2 Copies)',
		category_id: 'cat-print',
		agreed_price: 13000,
		scope: 'Hardcover binding of 2 complete copies of MSc dissertation in dark navy blue buckram with embossed gold lettering on front and spine. All 180 pages per volume pre-collated.',
		deliverables: [
			'2x Hardbound thesis volumes with UNILAG seal & gold lettering',
			'Spine text with candidate name, matric number, year 2026',
			'Clear cellophane protective sleeves for both copies'
		],
		turnaround_description: '24 hours from deliverable drop-off',
		due_at: '2026-10-16T14:00:00Z',
		milestones: [
			{
				id: 'm-1',
				title: 'Draft spine foil preview approved',
				description: 'Vendor sends WhatsApp photo of font & matric embossing proof',
				completed: true,
				completed_at: '2026-10-15T11:00:00Z'
			},
			{
				id: 'm-2',
				title: 'Binding & hard cover gluing complete',
				description: 'Both books bound, pressed in hydraulic vise for 8 hours',
				completed: true,
				completed_at: '2026-10-15T16:30:00Z'
			},
			{
				id: 'm-3',
				title: 'Student physical inspection & collection',
				description: 'Student inspects page alignment, typos on spine, and confirms satisfaction',
				completed: false
			}
		],
		status: 'awaiting_confirmation',
		simulated_payment: {
			status: 'simulated_held',
			amount: 13000,
			disclaimer: 'DEMO ONLY: Payment is simulated. No real funds are collected or held by AKOKA.'
		},
		evidence_attachments: [
			{
				id: 'ev-1',
				title: 'Spine Embossing Proof Photo',
				url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
				uploader: 'K-Print Digital Hub',
				uploaded_at: '2026-10-15T11:05:00Z'
			}
		],
		cancellation_terms: 'Full simulated refund before foil stamping commences; 50% simulated charge if buckram board has already been cut.',
		created_at: '2026-10-14T09:00:00Z',
		updated_at: '2026-10-15T16:35:00Z'
	},
	{
		id: 'TX-8835',
		buyer_id: 'user-stud-2',
		buyer_name: 'Folake Adeleke (Law Faculty)',
		vendor_id: 'ven-3',
		vendor_name: 'Sisi Akoka Monograms & Fit',
		listing_id: 'list-104',
		item_title: 'Moot Court Suit Alteration & Waist Adjustments',
		category_id: 'cat-tailoring',
		agreed_price: 3600,
		scope: 'Alter 1 navy blazer (shorten sleeves by 1.5 inches) and take in waist on matching formal trousers by 2 inches.',
		deliverables: [
			'Shortened blazer sleeves with clean interior cuff finish',
			'Tapered waist & thigh on formal trousers',
			'Steam press on high crease'
		],
		turnaround_description: 'Same-day 5 hours pickup',
		due_at: '2026-10-15T18:00:00Z',
		milestones: [
			{
				id: 'm-10',
				title: 'Garment pinned & measured',
				description: 'Student tries on garments at shop for exact pin marking',
				completed: true,
				completed_at: '2026-10-15T10:30:00Z'
			},
			{
				id: 'm-11',
				title: 'Alteration completed & steam pressed',
				description: 'Garments ready on wooden hanger with plastic dust shield',
				completed: true,
				completed_at: '2026-10-15T15:00:00Z'
			}
		],
		status: 'completed',
		simulated_payment: {
			status: 'simulated_released',
			amount: 3600,
			disclaimer: 'DEMO ONLY: Payment is simulated. No real funds are collected or held by AKOKA.'
		},
		evidence_attachments: [
			{
				id: 'ev-2',
				title: 'Final Pressed Suit Hanger Photo',
				url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
				uploader: 'Sisi Akoka Monograms & Fit',
				uploaded_at: '2026-10-15T15:10:00Z'
			}
		],
		cancellation_terms: 'Agreement locked once fabric has been cut or unstitched.',
		created_at: '2026-10-15T09:45:00Z',
		updated_at: '2026-10-15T16:00:00Z'
	},
	{
		id: 'TX-8840',
		buyer_id: 'user-stud-3',
		buyer_name: 'Tobi Bakare (Computer Science)',
		vendor_id: 'ven-2',
		vendor_name: 'Alaba Tech Medic (CITS Annex)',
		listing_id: 'list-103',
		item_title: 'Dell Inspiron 15 Left Hinge Re-weld & Bezel Fix',
		category_id: 'cat-repairs',
		agreed_price: 12000,
		scope: 'Re-weld fractured left hinge brass anchors inside display shell; prevent screen wobble without damaging display cable.',
		deliverables: [
			'Reinforced hinge casing with 30-day warranty slip',
			'Preserved internal webcam & WiFi antenna wiring',
			'Smooth 120-degree opening tension check'
		],
		turnaround_description: '6 hours turnaround',
		due_at: '2026-10-15T19:00:00Z',
		milestones: [
			{
				id: 'm-20',
				title: 'Diagnostic disassembly & photo record',
				description: 'PC disassembled, photos taken of existing cable integrity',
				completed: true,
				completed_at: '2026-10-15T13:00:00Z'
			},
			{
				id: 'm-21',
				title: 'Epoxy resin injection & 4h clamp cure',
				description: 'Brass sockets set in hardened resin substrate',
				completed: false
			}
		],
		status: 'in_progress',
		simulated_payment: {
			status: 'simulated_held',
			amount: 12000,
			disclaimer: 'DEMO ONLY: Payment is simulated. No real funds are collected or held by AKOKA.'
		},
		evidence_attachments: [],
		cancellation_terms: 'Diagnostic inspection free if cancellation occurs before epoxy application.',
		created_at: '2026-10-15T12:30:00Z',
		updated_at: '2026-10-15T13:05:00Z'
	}
];

export const SEED_EVENTS: TransactionEvent[] = [
	{
		id: 'ev-log-1',
		transaction_id: 'TX-8821',
		actor_id: 'user-stud-1',
		actor_name: 'Chinedu Eze',
		actor_role: 'student',
		event_type: 'created',
		details: 'Transaction draft created for 2x Hardcover Thesis Binding',
		created_at: '2026-10-14T09:00:00Z'
	},
	{
		id: 'ev-log-2',
		transaction_id: 'TX-8821',
		actor_id: 'ven-1',
		actor_name: 'K-Print Digital Hub',
		actor_role: 'vendor',
		event_type: 'agreement_accepted',
		details: 'Vendor accepted terms, confirmed 24h turnaround and due date of Oct 16, 2:00 PM',
		created_at: '2026-10-14T09:20:00Z'
	},
	{
		id: 'ev-log-3',
		transaction_id: 'TX-8821',
		actor_id: 'user-stud-1',
		actor_name: 'Chinedu Eze',
		actor_role: 'student',
		event_type: 'payment_simulated',
		details: 'Simulated payment of ₦13,000 authorized and held in demo state. No funds collected.',
		created_at: '2026-10-14T09:25:00Z'
	},
	{
		id: 'ev-log-4',
		transaction_id: 'TX-8821',
		actor_id: 'ven-1',
		actor_name: 'K-Print Digital Hub',
		actor_role: 'vendor',
		event_type: 'deliverable_submitted',
		details: 'Milestone 2 completed. Proof photo attached. Marked awaiting student collection confirmation.',
		created_at: '2026-10-15T16:30:00Z'
	}
];

export const SEED_REVIEWS: Review[] = [
	{
		id: 'rev-1',
		transaction_id: 'TX-8835',
		reviewer_id: 'user-stud-2',
		reviewer_name: 'Folake Adeleke (Law)',
		vendor_id: 'ven-3',
		rating: 5,
		comment: 'Amazing precision! My moot court blazer was drowning me, and Sisi Akoka altered the sleeves in 4 hours flat. Documented the price on AKOKA before I dropped it off so there was zero arguments.',
		verified_purchase: true,
		created_at: '2026-10-15T16:15:00Z'
	},
	{
		id: 'rev-2',
		transaction_id: 'TX-8790',
		reviewer_id: 'user-stud-4',
		reviewer_name: 'Ibrahim Bello (Engineering)',
		vendor_id: 'ven-1',
		rating: 5,
		comment: 'They printed my 140-page technical report with zero page skips. Golden lettering on the spine was aligned to the millimeter. Very reliable.',
		verified_purchase: true,
		created_at: '2026-10-11T17:30:00Z'
	},
	{
		id: 'rev-3',
		transaction_id: 'TX-8650',
		reviewer_id: 'user-stud-5',
		reviewer_name: 'Amarachi Okafor (Pharmacy)',
		vendor_id: 'ven-2',
		rating: 4,
		comment: 'Fixed my laptop screen cable at CITS. Was transparent about the parts used. Gave me a receipt with 30-day warranty.',
		verified_purchase: true,
		created_at: '2026-10-08T12:00:00Z'
	}
];

export const SEED_REPORTS: Report[] = [
	{
		id: 'rep-1',
		reporter_id: 'user-stud-9',
		reporter_name: 'Anonymous Student',
		target_type: 'price_observation',
		target_id: 'obs-99',
		reason: 'Stale / Outdated Price',
		details: 'The vendor at New Hall no longer prints color at ₦70. They increased it to ₦100 due to toner costs.',
		status: 'pending',
		created_at: '2026-10-15T08:15:00Z'
	},
	{
		id: 'rep-2',
		reporter_id: 'user-stud-6',
		reporter_name: 'Kelechi M.',
		target_type: 'listing',
		target_id: 'list-999',
		reason: 'Misleading Scope',
		details: 'Listing claims to include battery replacement but charges extra ₦4,000 for labor at pickup.',
		status: 'reviewed',
		created_at: '2026-10-14T18:40:00Z'
	}
];
