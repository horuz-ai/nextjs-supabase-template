# Next.js Template with Authentication & Payments

A production-ready Next.js 15 template featuring Supabase authentication, Stripe payments, and a comprehensive dashboard with sidebar navigation.

## Features

- 🔐 **Complete Authentication System** (Supabase)
  - Email/Password
  - Magic Links
  - Phone/SMS (via Twilio)
  - Social Login (Google OAuth)
- 💳 **Stripe Payment Integration**
  - Checkout Sessions
  - Payment Elements
  - Embedded Checkout
  - Webhook handling
- 🎨 **Modern UI with shadcn/ui**
  - 40+ pre-configured components
  - Responsive sidebar navigation
  - Dark mode ready
- 📱 **Protected Dashboard**
  - Collapsible sidebar
  - Breadcrumb navigation
  - Active route highlighting
  - Mobile responsive

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Navigation System

This template includes a powerful sidebar navigation system for protected routes. Here's how to use and customize it:

### Navigation Configuration

All navigation items are configured in `/lib/navigation-config.ts`. This centralized configuration makes it easy to manage your app's navigation structure:

```typescript
// lib/navigation-config.ts
export const navigationConfig = {
  mainNav: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      // Optional: specify sub-items
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Project Name",
      url: "/projects/project-id",
      icon: FileText,
    },
  ],
}
```

### Adding New Routes

1. **Add to Navigation Config**: Update `/lib/navigation-config.ts` with your new route
2. **Create Page**: Add the corresponding page file in `app/(protected)/your-route/page.tsx`
3. **Icons**: Import icons from `lucide-react` for consistent styling

Example of adding a new main navigation item:

```typescript
{
  title: "Customers",
  url: "/customers",
  icon: Users,
  items: [
    { title: "All Customers", url: "/customers" },
    { title: "Segments", url: "/customers/segments" },
    { title: "Analytics", url: "/customers/analytics" },
  ],
}
```

### Navigation Features

- **Active State Highlighting**: Current page is automatically highlighted in the sidebar
- **Auto-expansion**: Parent menus expand when you're on a sub-page
- **Breadcrumbs**: Automatically generated from the current route
- **Collapsible Sidebar**: Click the hamburger menu to collapse/expand
- **Mobile Responsive**: Sidebar becomes a drawer on mobile devices

### Protected Routes Structure

All protected routes should be placed under `app/(protected)/`:

```
app/(protected)/
├── layout.tsx          # Contains sidebar wrapper
├── dashboard/
│   └── page.tsx
├── projects/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── settings/
    ├── page.tsx
    ├── general/page.tsx
    ├── team/page.tsx
    └── billing/page.tsx
```

### Customizing the Sidebar

The sidebar components are located in `components/protected/`:

- `app-sidebar.tsx` - Main sidebar container
- `nav-main.tsx` - Main navigation items with collapsible sections
- `nav-projects.tsx` - Projects section
- `nav-user.tsx` - User menu with logout functionality
- `breadcrumb-nav.tsx` - Automatic breadcrumb generation

### User Menu Integration

The sidebar automatically integrates with Supabase authentication:
- Displays user name and email
- Shows user avatar (if available)
- Provides quick access to profile settings
- Includes logout functionality

### Team/Workspace Switcher

The template includes a team switcher component. To customize:

1. Update the teams data in `components/protected/app-sidebar.tsx`
2. Connect to your database to fetch real team/workspace data
3. Handle team switching logic in the `TeamSwitcher` component

### Best Practices

1. **Consistent URLs**: Use kebab-case for URLs (e.g., `/user-settings` not `/userSettings`)
2. **Icon Usage**: Always provide icons for main navigation items
3. **Logical Grouping**: Group related pages under parent items
4. **Breadcrumb-Friendly**: Structure URLs hierarchically for clear breadcrumbs
5. **Mobile First**: Test navigation on mobile devices regularly

### Extending the Navigation

To add new navigation sections:

1. Create a new nav component in `components/protected/`
2. Import and add it to the sidebar in `app-sidebar.tsx`
3. Update the navigation config with your new section

The navigation system is designed to be flexible and easy to extend while maintaining consistency across your application.
