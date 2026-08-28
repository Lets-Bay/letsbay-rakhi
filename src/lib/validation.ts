import { z } from 'zod';

const RESERVED_SLUGS = [
    'admin', 'login', 'signup', 'dashboard', 'api', 'settings',
    'rakhi', 'create', 'share', 'profile', 'about', 'contact',
    'help', 'terms', 'privacy', 'static', 'public', '_next',
];

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

export const createProfileSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
    slug: z
        .string()
        .min(3, 'Slug must be at least 3 characters')
        .max(30)
        .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
        .refine((val) => !RESERVED_SLUGS.includes(val), 'This name is reserved')
        .optional(),
    customMessage: z.string().max(200).optional(),
});

export const submitRakhiSchema = z.object({
    designId: z.string().min(1, 'Please select a Rakhi design'),
    senderName: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
    message: z.string().min(1, 'Please write a message').max(500).trim(),
});

export const updateSettingsSchema = z.object({
    name: z.string().min(2).max(50).trim().optional(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z.string().min(6).max(100).optional(),
}).refine(
    (data) => {
        if (data.newPassword && !data.currentPassword) return false;
        return true;
    },
    { message: 'Current password is required to change password', path: ['currentPassword'] }
);

export function generateSlug(name: string): string {
    let slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (slug.length < 3) {
        slug = slug + '-' + Math.random().toString(36).substring(2, 6);
    }

    if (RESERVED_SLUGS.includes(slug)) {
        slug = slug + '-' + Math.random().toString(36).substring(2, 6);
    }

    return slug;
}
