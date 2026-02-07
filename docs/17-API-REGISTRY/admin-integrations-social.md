# Admin Integrations — Social & AI Platforms

## Module Info

| Property | Value |
|----------|-------|
| Domain | admin-integrations-social |
| Source Files | server/src/routes/admin/integrations-social.routes.ts |
| Endpoint Count | ~34 |
| Mount Point | `/api/admin` |
| Auth Middleware | `requireFullAccess` (blocks fulfillment role) |

## Notes

Settings management for AI (OpenAI) and social commerce platform integrations.
Each platform follows a consistent pattern: GET (read), PATCH (update), DELETE (disconnect), POST verify, and optionally POST sync.

Platforms covered: OpenAI, TikTok Shop, Instagram Shop, Pinterest Shopping, YouTube Shopping, Snapchat Shopping, X/Twitter Shopping.

<!-- === AUTO-GENERATED SECTION (do not edit below this line) === -->

## Endpoints

### OpenAI Settings
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/openai` | 8 |
| `PATCH` | `/api/admin/settings/openai` | 23 |
| `DELETE` | `/api/admin/settings/openai` | 53 |

### TikTok Shop
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/tiktok-shop` | 73 |
| `PATCH` | `/api/admin/settings/tiktok-shop` | 90 |
| `POST` | `/api/admin/settings/tiktok-shop/verify` | 123 |
| `DELETE` | `/api/admin/settings/tiktok-shop` | 133 |

### Instagram Shop
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/instagram-shop` | 153 |
| `PATCH` | `/api/admin/settings/instagram-shop` | 168 |
| `POST` | `/api/admin/settings/instagram-shop/verify` | 199 |
| `DELETE` | `/api/admin/settings/instagram-shop` | 209 |

### Pinterest Shopping
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/pinterest-shopping` | 227 |
| `PATCH` | `/api/admin/settings/pinterest-shopping` | 247 |
| `POST` | `/api/admin/settings/pinterest-shopping/verify` | 282 |
| `POST` | `/api/admin/integrations/pinterest-shopping/sync` | 292 |
| `DELETE` | `/api/admin/settings/pinterest-shopping` | 302 |

### YouTube Shopping
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/youtube-shopping` | 326 |
| `PATCH` | `/api/admin/settings/youtube-shopping` | 346 |
| `POST` | `/api/admin/settings/youtube-shopping/verify` | 381 |
| `POST` | `/api/admin/integrations/youtube-shopping/sync` | 391 |
| `DELETE` | `/api/admin/settings/youtube-shopping` | 401 |

### Snapchat Shopping
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/snapchat-shopping` | 425 |
| `PATCH` | `/api/admin/settings/snapchat-shopping` | 445 |
| `POST` | `/api/admin/settings/snapchat-shopping/verify` | 480 |
| `POST` | `/api/admin/integrations/snapchat-shopping/sync` | 490 |
| `DELETE` | `/api/admin/settings/snapchat-shopping` | 500 |

### X/Twitter Shopping
| Method | Path | Line |
|--------|------|------|
| `GET` | `/api/admin/settings/x-shopping` | 524 |
| `PATCH` | `/api/admin/settings/x-shopping` | 544 |
| `POST` | `/api/admin/settings/x-shopping/verify` | 579 |
| `POST` | `/api/admin/integrations/x-shopping/sync` | 589 |
| `DELETE` | `/api/admin/settings/x-shopping` | 599 |

_~34 endpoint(s) detected._

<!-- === END AUTO-GENERATED SECTION === -->
