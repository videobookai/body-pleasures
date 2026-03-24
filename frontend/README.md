
# Body Pleasures

Body Pleasures is a full-stack e-commerce application built with Next.js, TypeScript, and Tailwind CSS for the frontend, and Strapi for the backend. It provides a platform for selling artisan soaps, body care products, and wellness essentials.

## Features
*   **Product Catalog:** Browse products by category, view product details, and add items to the cart.
*   **Shopping Cart:** A fully functional shopping cart to manage selected products before checkout.
*   **Responsive Design:** A mobile-friendly and responsive user interface for a seamless experience across all devices.
*   **Admin Panel:** A Strapi-powered admin panel to manage products, categories, and other content.

## Technologies Used

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) - A React framework for building server-side rendered and static websites.
    *   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    *   [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable UI components.
    *   [axios](https://axios-http.com/) - A promise-based HTTP client for the browser and Node.js.
*   **Backend:**
    *   [Strapi](https://strapi.io/) - An open-source headless CMS to manage and deliver content.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or higher)
*   npm, pnpm, or yarn
*   PostgreSQL (or another supported database)

### Frontend Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/videobookai/body-pleasures.git
    cd body-pleasures
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Set up environment variables (Strapi Cloud):**

    Create a file named `.env.local` in the `frontend` directory and add:

    ```env
    NEXT_PUBLIC_BASE_URL=https://your-project-name.strapiapp.com
    NEXT_PUBLIC_API_URL=https://your-project-name.strapiapp.com/api
    NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token
    ```

    Replace the values with your Strapi Cloud project URL and a Strapi API token from your Strapi Cloud admin.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Strapi Cloud Setup

This frontend is configured to consume a hosted Strapi Cloud backend instead of a local Strapi instance.

1.  Create or open your Strapi Cloud project.
2.  Ensure required content types (such as products and categories) are published.
3.  Create an API token in Strapi (`Settings -> API Tokens`) with read permissions for the content used by this frontend.
4.  Add your Strapi Cloud URL and token to `frontend/.env.local` using the variables above.

If you still run a local Strapi project for content management, keep it independent from frontend runtime config and only point `NEXT_PUBLIC_API_URL` to Strapi Cloud in this README setup.



