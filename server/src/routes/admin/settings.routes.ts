import { Router } from "express";
import { storage } from "../../../storage";

const router = Router();

export const integrationsStatusRoutes = Router();

integrationsStatusRoutes.get("/", async (req: any, res) => {
  const { stripeService } = await import("../../integrations/stripe");
  const { openaiService } = await import("../../integrations/openai/OpenAIService");
  const stripeConfig = await stripeService.getConfig();
  const intSettings = await storage.getIntegrationSettings();
  
  const emailSettings = await storage.getEmailSettings();
  
  const cloudflareR2Configured = !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
    process.env.CLOUDFLARE_R2_BUCKET_NAME
  );

  const activeMode = (intSettings?.stripeActiveMode as "test" | "live") || "test";
  const testConfigured = !!(intSettings?.stripePublishableKeyTest && intSettings?.stripeSecretKeyTestEncrypted);
  const liveConfigured = !!(intSettings?.stripePublishableKeyLive && intSettings?.stripeSecretKeyLiveEncrypted);
  
  res.json({
    stripe: stripeConfig.configured,
    stripeMode: stripeConfig.mode,
    stripeActiveMode: activeMode,
    stripeTestConfigured: testConfigured,
    stripeLiveConfigured: liveConfigured,
    stripeWebhook: !!stripeConfig.webhookSecret,
    mailgun: emailSettings?.provider === "mailgun" && !!emailSettings.mailgunApiKeyEncrypted,
    cloudflareR2: cloudflareR2Configured,
    openai: intSettings?.openaiConfigured || false,
    tiktokShop: intSettings?.tiktokShopConfigured || false,
    instagramShop: intSettings?.instagramShopConfigured || false,
    pinterestShopping: intSettings?.pinterestShoppingConfigured || false,
    youtubeShopping: intSettings?.youtubeShoppingConfigured || false,
    snapchatShopping: intSettings?.snapchatShoppingConfigured || false,
    xShopping: intSettings?.xShoppingConfigured || false,
    mailchimp: intSettings?.mailchimpConfigured || false,
    googlePlaces: intSettings?.googlePlacesConfigured || false,
  });
});

router.get("/", async (req: any, res) => {
  try {
    let settings = await storage.getSiteSettings();
    if (!settings) {
      settings = await storage.updateSiteSettings({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

router.patch("/", async (req: any, res) => {
  try {
    const settings = await storage.updateSiteSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

router.get("/email", async (req: any, res) => {
  try {
    const settings = await storage.getEmailSettings();
    if (!settings) {
      return res.json({ provider: "none" });
    }
    res.json({
      provider: settings.provider,
      mailgunDomain: settings.mailgunDomain,
      mailgunFromEmail: settings.mailgunFromEmail,
      mailgunFromName: settings.mailgunFromName,
      mailgunReplyTo: settings.mailgunReplyTo,
      mailgunRegion: settings.mailgunRegion,
      hasApiKey: !!settings.mailgunApiKeyEncrypted,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch email settings" });
  }
});

router.patch("/email", async (req: any, res) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { provider, mailgunApiKey, mailgunDomain, mailgunFromEmail, mailgunFromName, mailgunReplyTo, mailgunRegion } = req.body;

    const updateData: any = { provider };
    
    if (provider === "mailgun") {
      if (mailgunDomain) updateData.mailgunDomain = mailgunDomain;
      if (mailgunFromEmail) updateData.mailgunFromEmail = mailgunFromEmail;
      if (mailgunFromName !== undefined) updateData.mailgunFromName = mailgunFromName;
      if (mailgunReplyTo !== undefined) updateData.mailgunReplyTo = mailgunReplyTo;
      if (mailgunRegion) updateData.mailgunRegion = mailgunRegion;
      if (mailgunApiKey) {
        updateData.mailgunApiKeyEncrypted = encrypt(mailgunApiKey);
      }
    }

    const settings = await storage.updateEmailSettings(updateData);
    
    const adminId = (req as any).adminUser?.id;
    if (adminId) {
      await storage.createAdminAuditLog({
        adminId,
        action: "update_email_settings",
        targetType: "settings",
        targetId: "email",
        details: { provider, hasApiKey: !!mailgunApiKey },
        ipAddress: req.ip || null,
      });
    }
    
    res.json({
      provider: settings.provider,
      mailgunDomain: settings.mailgunDomain,
      mailgunFromEmail: settings.mailgunFromEmail,
      mailgunFromName: settings.mailgunFromName,
      mailgunReplyTo: settings.mailgunReplyTo,
      mailgunRegion: settings.mailgunRegion,
      hasApiKey: !!settings.mailgunApiKeyEncrypted,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    console.error("Email settings update error:", error);
    res.status(500).json({ message: "Failed to update email settings" });
  }
});

router.post("/email/test", async (req: any, res) => {
  try {
    const { to } = req.body;
    if (!to) {
      return res.status(400).json({ message: "Email address required" });
    }

    const { emailService } = await import("../../integrations/mailgun");
    const result = await emailService.sendTestEmail(to);
    
    if (result.success) {
      res.json({ success: true, message: "Test email sent successfully" });
    } else {
      res.status(400).json({ success: false, message: result.error });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to send test email" });
  }
});

router.post("/email/verify", async (req: any, res) => {
  try {
    const { emailService } = await import("../../integrations/mailgun");
    const result = await emailService.verifyConfiguration();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ valid: false, error: error.message || "Failed to verify configuration" });
  }
});

router.get("/stripe", async (req: any, res) => {
  try {
    const { stripeService } = await import("../../integrations/stripe");
    const { maskKey } = await import("../../utils/encryption");
    const settings = await storage.getIntegrationSettings();

    const activeMode = (settings?.stripeActiveMode as "test" | "live") || "test";

    const testConfigured = !!(settings?.stripePublishableKeyTest && settings?.stripeSecretKeyTestEncrypted);
    const liveConfigured = !!(settings?.stripePublishableKeyLive && settings?.stripeSecretKeyLiveEncrypted);

    let hasTestWebhookSecret = false;
    let hasLiveWebhookSecret = false;
    if (settings?.stripeWebhookSecretTestEncrypted) {
      try {
        const { decrypt } = await import("../../utils/encryption");
        decrypt(settings.stripeWebhookSecretTestEncrypted);
        hasTestWebhookSecret = true;
      } catch {}
    }
    if (settings?.stripeWebhookSecretLiveEncrypted) {
      try {
        const { decrypt } = await import("../../utils/encryption");
        decrypt(settings.stripeWebhookSecretLiveEncrypted);
        hasLiveWebhookSecret = true;
      } catch {}
    }

    let hasConnectWebhookSecret = false;
    let connectWebhookSecretSource: string | null = null;
    if (settings?.stripeConnectWebhookSecretEncrypted) {
      try {
        const { decrypt } = await import("../../utils/encryption");
        const val = decrypt(settings.stripeConnectWebhookSecretEncrypted);
        if (val) {
          hasConnectWebhookSecret = true;
          connectWebhookSecretSource = "database";
        }
      } catch {}
    }
    if (!hasConnectWebhookSecret && process.env.STRIPE_CONNECT_WEBHOOK_SECRET) {
      hasConnectWebhookSecret = true;
      connectWebhookSecretSource = "environment";
    }

    const legacyConfigured = !!(settings?.stripeConfigured && settings?.stripePublishableKey && settings?.stripeSecretKeyEncrypted);
    const hasLegacyWebhookSecret = !!settings?.stripeWebhookSecretEncrypted;
    const overallConfigured = testConfigured || liveConfigured || legacyConfigured;
    const source = overallConfigured && (testConfigured || liveConfigured) ? "database" : (legacyConfigured ? "database_legacy" : "environment");

    res.json({
      configured: overallConfigured,
      activeMode,
      test: {
        configured: testConfigured,
        publishableKeyMasked: settings?.stripePublishableKeyTest ? maskKey(settings.stripePublishableKeyTest) : null,
        hasWebhookSecret: hasTestWebhookSecret,
      },
      live: {
        configured: liveConfigured,
        publishableKeyMasked: settings?.stripePublishableKeyLive ? maskKey(settings.stripePublishableKeyLive) : null,
        hasWebhookSecret: hasLiveWebhookSecret,
      },
      hasConnectWebhookSecret,
      connectWebhookSecretSource,
      legacy: legacyConfigured ? {
        mode: settings?.stripeMode || "test",
        publishableKeyMasked: settings?.stripePublishableKey ? maskKey(settings.stripePublishableKey) : null,
        hasWebhookSecret: hasLegacyWebhookSecret,
      } : null,
      updatedAt: settings?.updatedAt || null,
      source,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Stripe settings" });
  }
});

router.patch("/stripe", async (req: any, res) => {
  try {
    const { encrypt, maskKey } = await import("../../utils/encryption");
    const { stripeService } = await import("../../integrations/stripe");
    const { environment, publishableKey, secretKey, webhookSecret, connectWebhookSecret, activeMode } = req.body;

    const updateData: any = {};
    let auditDetails: any = {};

    if (activeMode !== undefined) {
      if (activeMode !== "test" && activeMode !== "live") {
        return res.status(400).json({ message: "activeMode must be 'test' or 'live'" });
      }
      updateData.stripeActiveMode = activeMode;
      auditDetails.activeModeChanged = activeMode;
    }

    if (environment && (publishableKey || secretKey)) {
      if (environment !== "test" && environment !== "live") {
        return res.status(400).json({ message: "environment must be 'test' or 'live'" });
      }
      if (!publishableKey || !secretKey) {
        return res.status(400).json({ message: "Both Publishable Key and Secret Key are required when updating keys" });
      }

      const expectedPkPrefix = environment === "live" ? "pk_live_" : "pk_test_";
      const expectedSkPrefix = environment === "live" ? "sk_live_" : "sk_test_";

      if (!publishableKey.startsWith(expectedPkPrefix)) {
        return res.status(400).json({ message: `Publishable key must start with ${expectedPkPrefix} for ${environment} environment` });
      }
      if (!secretKey.startsWith(expectedSkPrefix)) {
        return res.status(400).json({ message: `Secret key must start with ${expectedSkPrefix} for ${environment} environment` });
      }

      const pkMode = publishableKey.startsWith("pk_live_") ? "live" : "test";
      const skMode = secretKey.startsWith("sk_live_") ? "live" : "test";
      if (pkMode !== skMode) {
        return res.status(400).json({ message: "Publishable key and secret key must be from the same mode (both test or both live)" });
      }

      const validation = await stripeService.validateKeys(publishableKey, secretKey);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
      }

      if (environment === "test") {
        updateData.stripePublishableKeyTest = publishableKey;
        updateData.stripeSecretKeyTestEncrypted = encrypt(secretKey);
      } else {
        updateData.stripePublishableKeyLive = publishableKey;
        updateData.stripeSecretKeyLiveEncrypted = encrypt(secretKey);
      }

      updateData.stripeConfigured = true;
      auditDetails.environment = environment;
      auditDetails.accountName = validation.accountName;
    }

    if (webhookSecret && environment) {
      if (environment === "test") {
        updateData.stripeWebhookSecretTestEncrypted = encrypt(webhookSecret);
      } else {
        updateData.stripeWebhookSecretLiveEncrypted = encrypt(webhookSecret);
      }
      auditDetails.hasWebhookSecret = true;
      auditDetails.webhookEnvironment = environment;
    }

    if (connectWebhookSecret) {
      updateData.stripeConnectWebhookSecretEncrypted = encrypt(connectWebhookSecret);
      auditDetails.hasConnectWebhookSecret = true;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const settings = await storage.updateIntegrationSettings(updateData);

    stripeService.clearCache();

    const adminId = (req as any).adminUser?.id;
    if (adminId) {
      try {
        await storage.createAdminAuditLog({
          adminId,
          action: "update_stripe_settings",
          targetType: "settings",
          targetId: "stripe",
          details: auditDetails,
          ipAddress: req.ip || null,
        });
      } catch (auditErr) {
        console.error("Failed to create audit log for Stripe settings update:", auditErr);
      }
    }

    res.json({
      success: true,
      activeMode: settings.stripeActiveMode || "test",
      updatedAt: settings.updatedAt,
    });
  } catch (error: any) {
    console.error("Stripe settings update error:", error);
    res.status(500).json({ message: error.message || "Failed to update Stripe settings" });
  }
});

router.post("/stripe/validate", async (req: any, res) => {
  try {
    const { stripeService } = await import("../../integrations/stripe");
    const { publishableKey, secretKey } = req.body;

    if (!publishableKey || !secretKey) {
      return res.status(400).json({ valid: false, error: "Both keys are required" });
    }

    const result = await stripeService.validateKeys(publishableKey, secretKey);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ valid: false, error: error.message || "Failed to validate keys" });
  }
});

export default router;
