
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

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add the following environment variable:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:1337/api
    ```

    This variable should point to the URL of your Strapi backend.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend Setup

The backend is a Strapi application located in the `miss-v-admin` directory.

1.  **Navigate to the backend directory:**

    ```bash
    cd miss-v-admin
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the `miss-v-admin` directory and add the following environment variables. You can use the `.env.example` file as a template.

    ```env
    HOST=0.0.0.0
    PORT=1337
    APP_KEYS="your_app_key_1,your_app_key_2"
    API_TOKEN_SALT=your_api_token_salt
    ADMIN_JWT_SECRET=your_admin_jwt_secret
    TRANSFER_TOKEN_SALT=your_transfer_token_salt
    JWT_SECRET=your_jwt_secret
    ENCRYPTION_KEY=your_encryption_key

    # Database configuration (example for PostgreSQL)
    DATABASE_CLIENT=postgres
    DATABASE_HOST=127.0.0.1
    DATABASE_PORT=5432
    DATABASE_NAME=strapi-db
    DATABASE_USERNAME=strapi-user
    DATABASE_PASSWORD=strapi-password
    DATABASE_SSL=false
    ```

    **Note:** You need to replace the placeholder values with your own secret keys and database credentials. You can generate secret keys using a tool like `openssl rand -base64 32`.

4.  **Run the development server:**

    ```bash
    npm run develop
    # or
    pnpm develop
    # or
    yarn develop
    ```

    The Strapi server will be running at [http://localhost:1337](http://localhost:1337). You can create an admin account and start adding content.



