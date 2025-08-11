# Handcrafted Haven

Handcrafted Haven is a web application for artisans to showcase and sell their handmade products. Built with **Next.js**, this app will serve as a virtual marketplace that connects creators with customers.

### Tech Stack

- **Front-End:** HTML, Tailwind CSS, JavaScript, Next.js
- **Back-End:** Node.js (Next.js API Routes), PostgreSQL (via Drizzle ORM)
- **Authentication:** NextAuth.js
- **ORM:** Drizzle ORM (schema-based migrations & type-safe queries)
- **Deployment/Cloud Platform:** Vercel
- **Database Hosting:** Vercel Postgres
- **Project Management:** GitHub Boards
- **Code Quality:** ESLint

### Features

- User authentication & authorization
- Seller and buyer roles
- Product listing & filtering by category
- Product detail pages with reviews
- Add new products (seller-only)
- Responsive UI with Tailwind CSS
- Server-side rendering (SSR) & static site generation (SSG)

### Live App: 

- https://handcrafted-haven-ashen.vercel.app/

### Project Board: 

- https://github.com/users/carolinepedasil/projects/2

### Test users:

- **Buyer:** buyer@admin.com / admin123
- **Seller:** seller@admin.com / admin123

### Prerequisites

Before running locally, make sure you have:

- Node.js >= 18
- PostgreSQL installed or a hosted database connection
- Environment variables set up (see .env.example)

### Environment Variables

```bash
DATABASE_URL=postgres://username:password@localhost:5432/dbname
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```