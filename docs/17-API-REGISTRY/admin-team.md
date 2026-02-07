# Admin Team

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-team |
| Source Files | server/src/routes/admin/team.routes.ts |
| Endpoint Count | 4 |
| Mount Point | `/api/admin/team` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Notes

RBAC team member management. Supports three roles: admin, store_manager, fulfillment.
Passwords are hashed with bcrypt before storage.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

| Method | Path | Handler | Line |
|--------|------|---------|------|
| `GET` | `/api/admin/team/` | List team members | — |
| `POST` | `/api/admin/team/` | Create team member | — |
| `PATCH` | `/api/admin/team/:id` | Update team member | — |
| `DELETE` | `/api/admin/team/:id` | Delete team member | — |

_4 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
