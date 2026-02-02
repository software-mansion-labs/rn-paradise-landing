# RN Paradise Landing Page

### ⚠️ Moved to: https://gl.swmansion.com/products/react-native/paradise/

A static landing page for RN Paradise, built with Astro and managed through Static CMS.

## Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
GCLOUD_PROJECT_ID=your_gcloud_project_id
SENDGRID_API_KEY=your_sendgrid_api_key
PUBLIC_ENABLE_ANALYTICS=false
IS_INDEXED=false
```

## Development with local CMS

In `config.yml` uncomment line below:

```
# local_backend: true
```

In a separate terminal run:

```
npm run cms:proxy
```

Access the site at `http://localhost:4321` and the CMS admin at `http://localhost:4321/admin/`.

## Content collections:

- General information (edition number, year)
- Hero section (event date, location)
- Venue info
- Team members
- Agenda events
- Previous editions
- Reservation options and rooms
- Video Section
- Contact info
- FAQ
