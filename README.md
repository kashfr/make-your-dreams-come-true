# Make Your Dreams Come True

A responsive one-page website template based on Dimension by HTML5 UP, modernized with Vite for efficient development.

## Features

- Fully responsive design
- Modal-based page navigation
- Clean, modern aesthetic
- Fast development with Vite
- Contact form with EmailJS integration

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [pnpm](https://pnpm.io/) (v7 or newer)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/make-your-dreams-come-true.git
   cd make-your-dreams-come-true
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```
   This will start the development server at http://localhost:3000.

### Build for Production

To build the site for production:

```bash
pnpm build
```

The built files will be in the `dist` directory.

To preview the production build locally:

```bash
pnpm preview
```

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

### Automatic Deployment

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the following settings:
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. Add the following environment variables in the Vercel project settings:
   ```
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```

5. Deploy!

### Manual Deployment

You can also deploy manually using the Vercel CLI:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment.

## Customization

- Edit the `index.html` file to update content
- Modify styles in the `assets/css/main.css` file or in the `assets/sass/` directory
- Update JavaScript functionality in `assets/js/main.js`
- Customize the contact form in `assets/js/contact.js`

## Credits

- Original template: [Dimension by HTML5 UP](https://html5up.net/dimension)
- Demo images: [Unsplash](https://unsplash.com/)
- Icons: [Font Awesome](https://fontawesome.io/)
- Built with: [Vite](https://vitejs.dev/)
- Email functionality: [EmailJS](https://www.emailjs.com/)

## License

This project is licensed under the terms of the [Creative Commons Attribution 3.0 License](https://html5up.net/license). 