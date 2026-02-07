# Feature Module Template

> Standard structure for new feature modules in the Power Plunge platform.
> All new routes should follow this pattern. Existing routes are being migrated incrementally.

## Directory Structure

```
server/src/
├── routes/
│   ├── admin/
│   │   └── {feature}.routes.ts      # Admin-only endpoints
│   ├── public/
│   │   └── {feature}.routes.ts      # Unauthenticated public endpoints
│   └── customer/
│       └── {feature}.routes.ts      # Authenticated customer endpoints
├── services/
│   └── {feature}.service.ts         # Business logic layer (optional, use when logic > simple CRUD)
└── (storage.ts uses Drizzle directly for data access)
```

## Route File Template

```typescript
// server/src/routes/admin/{feature}.routes.ts
import { Router, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../../../storage";

const router = Router();

// GET /api/admin/{feature}
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await storage.getItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// GET /api/admin/{feature}/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const item = await storage.getItem(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
});

// POST /api/admin/{feature}
const createSchema = z.object({
  name: z.string().min(1),
  // ... validation fields
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    const item = await storage.createItem(parsed.data);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to create item" });
  }
});

// PATCH /api/admin/{feature}/:id
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const item = await storage.updateItem(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item" });
  }
});

// DELETE /api/admin/{feature}/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deleteItem(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;
```

## Mounting in routes.ts

```typescript
// server/routes.ts
import featureRoutes from "./src/routes/admin/{feature}.routes";

// Inside registerRoutes():
app.use("/api/admin/{feature}", requireFullAccess, featureRoutes);
```

## Key Conventions

1. **Middleware is applied at mount level** — `requireAdmin`, `requireFullAccess`, or `isAuthenticated` is added in `routes.ts` when mounting, not inside the router file.
2. **Storage is the data layer** — Routes call `storage.*` methods directly. Services are used only when business logic exceeds simple CRUD (e.g., commission calculations, email workflows).
3. **Validation with Zod** — Define schemas at the top of the file using `z.object()`. Use `safeParse()` for user input.
4. **Error handling** — Every handler wraps in try/catch. Return `{ message: string }` on errors.
5. **No controller layer** — Routes call storage/services directly. Controllers add indirection with minimal benefit at this scale.
6. **Typed imports** — Use `Request, Response` from express. Cast `req` to `any` only when accessing session/auth properties.
7. **Feature flags** — For new experimental features, check `isCmsV2Enabled()` or similar flags at the mount level.

## Service Layer (When Needed)

Use a service when:
- Multiple routes share complex business logic
- External API calls need orchestration
- Transaction-level operations span multiple storage calls
- Side effects (emails, webhooks, audit logs) need coordination

```typescript
// server/src/services/{feature}.service.ts
import { storage } from "../../storage";

class FeatureService {
  async processItem(id: string, data: any) {
    // Complex business logic here
    const item = await storage.getItem(id);
    // ... orchestration, validation, side effects
    return storage.updateItem(id, data);
  }
}

export const featureService = new FeatureService();
```

## Migration Checklist

When extracting routes from `routes.ts`:

- [ ] Create router file in appropriate directory (admin/public/customer)
- [ ] Copy handlers verbatim — no behavior changes
- [ ] Keep all original route paths (mount prefix + handler path = same URL)
- [ ] Move middleware to mount level in routes.ts
- [ ] Add import and `app.use()` mount in routes.ts
- [ ] Remove old inline handlers from routes.ts (leave comment breadcrumb)
- [ ] Remove any now-unused imports from routes.ts
- [ ] Restart server and verify all endpoints still respond
- [ ] Test with curl or E2E to confirm response parity
