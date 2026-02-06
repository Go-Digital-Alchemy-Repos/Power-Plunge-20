# API Reference

This section contains auto-generated and manually maintained API documentation.

## API Structure

All API endpoints are prefixed with `/api/` and organized by access level:

- **Public:** `/api/products`, `/api/pages/*`, `/api/site-settings`
- **Customer:** `/api/customer/*` (requires customer auth)
- **Admin:** `/api/admin/*` (requires admin auth with role-based access)

## Authentication

- **Customer Auth:** Bearer token in Authorization header
- **Admin Auth:** Session-based with role checks (admin, store_manager, fulfillment)

## Auto-Generated Docs

Use the "Sync API Docs" feature in the Docs Browser to auto-generate endpoint documentation from route files. Generated docs are placed in the `17-API-REGISTRY` folder.
