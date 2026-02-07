import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

// ==================== OPENAI SETTINGS ====================

router.get("/settings/openai", async (req: Request, res: Response) => {
  try {
    const { maskKey } = await import("../../utils/encryption");
    const integrationSettings = await storage.getIntegrationSettings();
    
    res.json({
      configured: integrationSettings?.openaiConfigured || false,
      apiKeyMasked: integrationSettings?.openaiApiKeyEncrypted ? maskKey("sk-xxxx...configured") : null,
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch OpenAI settings" });
  }
});

router.patch("/settings/openai", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { openaiService } = await import("../../integrations/openai/OpenAIService");
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: "API key is required" });
    }

    if (!apiKey.startsWith("sk-")) {
      return res.status(400).json({ message: "Invalid API key format. Must start with 'sk-'" });
    }

    const updateData = {
      openaiApiKeyEncrypted: encrypt(apiKey),
      openaiConfigured: true,
    };

    await storage.updateIntegrationSettings(updateData);
    
    openaiService.clearCache();

    res.json({ success: true, message: "OpenAI configuration saved" });
  } catch (error: any) {
    console.error("Error saving OpenAI settings:", error);
    res.status(500).json({ message: error.message || "Failed to save OpenAI settings" });
  }
});

router.delete("/settings/openai", async (req: Request, res: Response) => {
  try {
    const { openaiService } = await import("../../integrations/openai/OpenAIService");
    
    await storage.updateIntegrationSettings({
      openaiApiKeyEncrypted: null,
      openaiConfigured: false,
    });
    
    openaiService.clearCache();

    res.json({ success: true, message: "OpenAI configuration removed" });
  } catch (error: any) {
    console.error("Error removing OpenAI settings:", error);
    res.status(500).json({ message: error.message || "Failed to remove OpenAI settings" });
  }
});

// ==================== TIKTOK SHOP SETTINGS ====================

router.get("/settings/tiktok-shop", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.tiktokShopConfigured || false,
      shopId: integrationSettings?.tiktokShopId || null,
      appKey: integrationSettings?.tiktokAppKey || null,
      hasAppSecret: !!integrationSettings?.tiktokAppSecretEncrypted,
      hasAccessToken: !!integrationSettings?.tiktokAccessTokenEncrypted,
      hasRefreshToken: !!integrationSettings?.tiktokRefreshTokenEncrypted,
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch TikTok Shop settings" });
  }
});

router.patch("/settings/tiktok-shop", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { tiktokShopService } = await import("../../integrations/tiktok-shop/TikTokShopService");
    const { shopId, appKey, appSecret, accessToken, refreshToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.tiktokShopConfigured;

    if (!isUpdate && (!shopId || !appKey)) {
      return res.status(400).json({ message: "Shop ID and App Key are required" });
    }

    const updateData: any = {
      tiktokShopConfigured: true,
    };

    if (shopId) updateData.tiktokShopId = shopId;
    if (appKey) updateData.tiktokAppKey = appKey;
    if (appSecret) updateData.tiktokAppSecretEncrypted = encrypt(appSecret);
    if (accessToken) updateData.tiktokAccessTokenEncrypted = encrypt(accessToken);
    if (refreshToken) updateData.tiktokRefreshTokenEncrypted = encrypt(refreshToken);

    await storage.updateIntegrationSettings(updateData);
    tiktokShopService.clearCache();

    res.json({ success: true, message: "TikTok Shop configuration saved" });
  } catch (error: any) {
    console.error("Error saving TikTok Shop settings:", error);
    res.status(500).json({ message: error.message || "Failed to save TikTok Shop settings" });
  }
});

router.post("/settings/tiktok-shop/verify", async (req: Request, res: Response) => {
  try {
    const { tiktokShopService } = await import("../../integrations/tiktok-shop/TikTokShopService");
    const result = await tiktokShopService.verify();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.delete("/settings/tiktok-shop", async (req: Request, res: Response) => {
  try {
    const { tiktokShopService } = await import("../../integrations/tiktok-shop/TikTokShopService");
    await storage.updateIntegrationSettings({
      tiktokShopConfigured: false,
      tiktokShopId: null,
      tiktokAppKey: null,
      tiktokAppSecretEncrypted: null,
      tiktokAccessTokenEncrypted: null,
      tiktokRefreshTokenEncrypted: null,
    });
    tiktokShopService.clearCache();
    res.json({ success: true, message: "TikTok Shop configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove TikTok Shop settings" });
  }
});

// ==================== INSTAGRAM SHOP SETTINGS ====================

router.get("/settings/instagram-shop", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.instagramShopConfigured || false,
      businessAccountId: integrationSettings?.instagramBusinessAccountId || null,
      catalogId: integrationSettings?.instagramCatalogId || null,
      hasAccessToken: !!integrationSettings?.instagramAccessTokenEncrypted,
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Instagram Shop settings" });
  }
});

router.patch("/settings/instagram-shop", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { instagramShopService } = await import("../../integrations/instagram-shop/InstagramShopService");
    const { businessAccountId, catalogId, accessToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.instagramShopConfigured;

    if (!isUpdate && !businessAccountId) {
      return res.status(400).json({ message: "Business Account ID is required" });
    }

    const updateData: any = {
      instagramShopConfigured: true,
    };

    if (businessAccountId) updateData.instagramBusinessAccountId = businessAccountId;
    if (catalogId) updateData.instagramCatalogId = catalogId;
    if (accessToken) updateData.instagramAccessTokenEncrypted = encrypt(accessToken);

    await storage.updateIntegrationSettings(updateData);
    instagramShopService.clearCache();

    res.json({ success: true, message: "Instagram Shop configuration saved" });
  } catch (error: any) {
    console.error("Error saving Instagram Shop settings:", error);
    res.status(500).json({ message: error.message || "Failed to save Instagram Shop settings" });
  }
});

router.post("/settings/instagram-shop/verify", async (req: Request, res: Response) => {
  try {
    const { instagramShopService } = await import("../../integrations/instagram-shop/InstagramShopService");
    const result = await instagramShopService.verify();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.delete("/settings/instagram-shop", async (req: Request, res: Response) => {
  try {
    const { instagramShopService } = await import("../../integrations/instagram-shop/InstagramShopService");
    await storage.updateIntegrationSettings({
      instagramShopConfigured: false,
      instagramBusinessAccountId: null,
      instagramCatalogId: null,
      instagramAccessTokenEncrypted: null,
    });
    instagramShopService.clearCache();
    res.json({ success: true, message: "Instagram Shop configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove Instagram Shop settings" });
  }
});

// ==================== PINTEREST SHOPPING SETTINGS ====================

router.get("/settings/pinterest-shopping", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.pinterestShoppingConfigured || false,
      merchantId: integrationSettings?.pinterestMerchantId || null,
      catalogId: integrationSettings?.pinterestCatalogId || null,
      clientId: integrationSettings?.pinterestClientId || null,
      hasClientSecret: !!integrationSettings?.pinterestClientSecretEncrypted,
      hasAccessToken: !!integrationSettings?.pinterestAccessTokenEncrypted,
      hasRefreshToken: !!integrationSettings?.pinterestRefreshTokenEncrypted,
      lastSyncAt: integrationSettings?.pinterestLastSyncAt || null,
      lastSyncStatus: integrationSettings?.pinterestLastSyncStatus || "never",
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Pinterest Shopping settings" });
  }
});

router.patch("/settings/pinterest-shopping", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { pinterestShoppingService } = await import("../../integrations/pinterest-shopping/PinterestShoppingService");
    const { merchantId, catalogId, clientId, clientSecret, accessToken, refreshToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.pinterestShoppingConfigured;

    if (!isUpdate && (!merchantId || !clientId)) {
      return res.status(400).json({ message: "Merchant ID and Client ID are required" });
    }

    const updateData: any = {
      pinterestShoppingConfigured: true,
    };

    if (merchantId) updateData.pinterestMerchantId = merchantId;
    if (catalogId) updateData.pinterestCatalogId = catalogId;
    if (clientId) updateData.pinterestClientId = clientId;
    if (clientSecret) updateData.pinterestClientSecretEncrypted = encrypt(clientSecret);
    if (accessToken) updateData.pinterestAccessTokenEncrypted = encrypt(accessToken);
    if (refreshToken) updateData.pinterestRefreshTokenEncrypted = encrypt(refreshToken);

    await storage.updateIntegrationSettings(updateData);
    pinterestShoppingService.clearCache();

    console.log(`[Audit] Pinterest Shopping settings updated by admin`);
    res.json({ success: true, message: "Pinterest Shopping configuration saved" });
  } catch (error: any) {
    console.error("Error saving Pinterest Shopping settings:", error);
    res.status(500).json({ message: error.message || "Failed to save Pinterest Shopping settings" });
  }
});

router.post("/settings/pinterest-shopping/verify", async (req: Request, res: Response) => {
  try {
    const { pinterestShoppingService } = await import("../../integrations/pinterest-shopping/PinterestShoppingService");
    const result = await pinterestShoppingService.verifyCredentials();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.post("/integrations/pinterest-shopping/sync", async (req: Request, res: Response) => {
  try {
    const { pinterestShoppingService } = await import("../../integrations/pinterest-shopping/PinterestShoppingService");
    const result = await pinterestShoppingService.syncCatalog();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Sync failed" });
  }
});

router.delete("/settings/pinterest-shopping", async (req: Request, res: Response) => {
  try {
    const { pinterestShoppingService } = await import("../../integrations/pinterest-shopping/PinterestShoppingService");
    await storage.updateIntegrationSettings({
      pinterestShoppingConfigured: false,
      pinterestMerchantId: null,
      pinterestCatalogId: null,
      pinterestClientId: null,
      pinterestClientSecretEncrypted: null,
      pinterestAccessTokenEncrypted: null,
      pinterestRefreshTokenEncrypted: null,
      pinterestLastSyncAt: null,
      pinterestLastSyncStatus: "never",
    });
    pinterestShoppingService.clearCache();
    console.log(`[Audit] Pinterest Shopping settings removed by admin`);
    res.json({ success: true, message: "Pinterest Shopping configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove Pinterest Shopping settings" });
  }
});

// ==================== YOUTUBE SHOPPING SETTINGS ====================

router.get("/settings/youtube-shopping", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.youtubeShoppingConfigured || false,
      channelId: integrationSettings?.youtubeChannelId || null,
      merchantId: integrationSettings?.youtubeMerchantId || null,
      clientId: integrationSettings?.youtubeClientId || null,
      hasClientSecret: !!integrationSettings?.youtubeClientSecretEncrypted,
      hasAccessToken: !!integrationSettings?.youtubeAccessTokenEncrypted,
      hasRefreshToken: !!integrationSettings?.youtubeRefreshTokenEncrypted,
      lastSyncAt: integrationSettings?.youtubeLastSyncAt || null,
      lastSyncStatus: integrationSettings?.youtubeLastSyncStatus || "never",
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch YouTube Shopping settings" });
  }
});

router.patch("/settings/youtube-shopping", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { youtubeShoppingService } = await import("../../integrations/youtube-shopping/YouTubeShoppingService");
    const { channelId, merchantId, clientId, clientSecret, accessToken, refreshToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.youtubeShoppingConfigured;

    if (!isUpdate && (!channelId || !clientId)) {
      return res.status(400).json({ message: "Channel ID and Client ID are required" });
    }

    const updateData: any = {
      youtubeShoppingConfigured: true,
    };

    if (channelId) updateData.youtubeChannelId = channelId;
    if (merchantId) updateData.youtubeMerchantId = merchantId;
    if (clientId) updateData.youtubeClientId = clientId;
    if (clientSecret) updateData.youtubeClientSecretEncrypted = encrypt(clientSecret);
    if (accessToken) updateData.youtubeAccessTokenEncrypted = encrypt(accessToken);
    if (refreshToken) updateData.youtubeRefreshTokenEncrypted = encrypt(refreshToken);

    await storage.updateIntegrationSettings(updateData);
    youtubeShoppingService.clearCache();

    console.log(`[Audit] YouTube Shopping settings updated by admin`);
    res.json({ success: true, message: "YouTube Shopping configuration saved" });
  } catch (error: any) {
    console.error("Error saving YouTube Shopping settings:", error);
    res.status(500).json({ message: error.message || "Failed to save YouTube Shopping settings" });
  }
});

router.post("/settings/youtube-shopping/verify", async (req: Request, res: Response) => {
  try {
    const { youtubeShoppingService } = await import("../../integrations/youtube-shopping/YouTubeShoppingService");
    const result = await youtubeShoppingService.verifyCredentials();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.post("/integrations/youtube-shopping/sync", async (req: Request, res: Response) => {
  try {
    const { youtubeShoppingService } = await import("../../integrations/youtube-shopping/YouTubeShoppingService");
    const result = await youtubeShoppingService.syncCatalog();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Sync failed" });
  }
});

router.delete("/settings/youtube-shopping", async (req: Request, res: Response) => {
  try {
    const { youtubeShoppingService } = await import("../../integrations/youtube-shopping/YouTubeShoppingService");
    await storage.updateIntegrationSettings({
      youtubeShoppingConfigured: false,
      youtubeChannelId: null,
      youtubeMerchantId: null,
      youtubeClientId: null,
      youtubeClientSecretEncrypted: null,
      youtubeAccessTokenEncrypted: null,
      youtubeRefreshTokenEncrypted: null,
      youtubeLastSyncAt: null,
      youtubeLastSyncStatus: "never",
    });
    youtubeShoppingService.clearCache();
    console.log(`[Audit] YouTube Shopping settings removed by admin`);
    res.json({ success: true, message: "YouTube Shopping configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove YouTube Shopping settings" });
  }
});

// ==================== SNAPCHAT SHOPPING SETTINGS ====================

router.get("/settings/snapchat-shopping", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.snapchatShoppingConfigured || false,
      accountId: integrationSettings?.snapchatAccountId || null,
      catalogId: integrationSettings?.snapchatCatalogId || null,
      clientId: integrationSettings?.snapchatClientId || null,
      hasClientSecret: !!integrationSettings?.snapchatClientSecretEncrypted,
      hasAccessToken: !!integrationSettings?.snapchatAccessTokenEncrypted,
      hasRefreshToken: !!integrationSettings?.snapchatRefreshTokenEncrypted,
      lastSyncAt: integrationSettings?.snapchatLastSyncAt || null,
      lastSyncStatus: integrationSettings?.snapchatLastSyncStatus || "never",
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Snapchat Shopping settings" });
  }
});

router.patch("/settings/snapchat-shopping", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { snapchatShoppingService } = await import("../../integrations/snapchat-shopping/SnapchatShoppingService");
    const { accountId, catalogId, clientId, clientSecret, accessToken, refreshToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.snapchatShoppingConfigured;

    if (!isUpdate && (!accountId || !clientId)) {
      return res.status(400).json({ message: "Account ID and Client ID are required" });
    }

    const updateData: any = {
      snapchatShoppingConfigured: true,
    };

    if (accountId) updateData.snapchatAccountId = accountId;
    if (catalogId) updateData.snapchatCatalogId = catalogId;
    if (clientId) updateData.snapchatClientId = clientId;
    if (clientSecret) updateData.snapchatClientSecretEncrypted = encrypt(clientSecret);
    if (accessToken) updateData.snapchatAccessTokenEncrypted = encrypt(accessToken);
    if (refreshToken) updateData.snapchatRefreshTokenEncrypted = encrypt(refreshToken);

    await storage.updateIntegrationSettings(updateData);
    snapchatShoppingService.clearCache();

    console.log(`[Audit] Snapchat Shopping settings updated by admin`);
    res.json({ success: true, message: "Snapchat Shopping configuration saved" });
  } catch (error: any) {
    console.error("Error saving Snapchat Shopping settings:", error);
    res.status(500).json({ message: error.message || "Failed to save Snapchat Shopping settings" });
  }
});

router.post("/settings/snapchat-shopping/verify", async (req: Request, res: Response) => {
  try {
    const { snapchatShoppingService } = await import("../../integrations/snapchat-shopping/SnapchatShoppingService");
    const result = await snapchatShoppingService.verifyCredentials();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.post("/integrations/snapchat-shopping/sync", async (req: Request, res: Response) => {
  try {
    const { snapchatShoppingService } = await import("../../integrations/snapchat-shopping/SnapchatShoppingService");
    const result = await snapchatShoppingService.syncCatalog();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Sync failed" });
  }
});

router.delete("/settings/snapchat-shopping", async (req: Request, res: Response) => {
  try {
    const { snapchatShoppingService } = await import("../../integrations/snapchat-shopping/SnapchatShoppingService");
    await storage.updateIntegrationSettings({
      snapchatShoppingConfigured: false,
      snapchatAccountId: null,
      snapchatCatalogId: null,
      snapchatClientId: null,
      snapchatClientSecretEncrypted: null,
      snapchatAccessTokenEncrypted: null,
      snapchatRefreshTokenEncrypted: null,
      snapchatLastSyncAt: null,
      snapchatLastSyncStatus: "never",
    });
    snapchatShoppingService.clearCache();
    console.log(`[Audit] Snapchat Shopping settings removed by admin`);
    res.json({ success: true, message: "Snapchat Shopping configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove Snapchat Shopping settings" });
  }
});

// ==================== X SHOPPING SETTINGS ====================

router.get("/settings/x-shopping", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.xShoppingConfigured || false,
      accountId: integrationSettings?.xAccountId || null,
      catalogId: integrationSettings?.xCatalogId || null,
      clientId: integrationSettings?.xClientId || null,
      hasClientSecret: !!integrationSettings?.xClientSecretEncrypted,
      hasAccessToken: !!integrationSettings?.xAccessTokenEncrypted,
      hasRefreshToken: !!integrationSettings?.xRefreshTokenEncrypted,
      lastSyncAt: integrationSettings?.xLastSyncAt || null,
      lastSyncStatus: integrationSettings?.xLastSyncStatus || "never",
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch X Shopping settings" });
  }
});

router.patch("/settings/x-shopping", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { xShoppingService } = await import("../../integrations/x-shopping/XShoppingService");
    const { accountId, catalogId, clientId, clientSecret, accessToken, refreshToken } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.xShoppingConfigured;

    if (!isUpdate && (!accountId || !clientId)) {
      return res.status(400).json({ message: "Account ID and Client ID are required" });
    }

    const updateData: any = {
      xShoppingConfigured: true,
    };

    if (accountId) updateData.xAccountId = accountId;
    if (catalogId) updateData.xCatalogId = catalogId;
    if (clientId) updateData.xClientId = clientId;
    if (clientSecret) updateData.xClientSecretEncrypted = encrypt(clientSecret);
    if (accessToken) updateData.xAccessTokenEncrypted = encrypt(accessToken);
    if (refreshToken) updateData.xRefreshTokenEncrypted = encrypt(refreshToken);

    await storage.updateIntegrationSettings(updateData);
    xShoppingService.clearCache();

    console.log(`[Audit] X Shopping settings updated by admin`);
    res.json({ success: true, message: "X Shopping configuration saved" });
  } catch (error: any) {
    console.error("Error saving X Shopping settings:", error);
    res.status(500).json({ message: error.message || "Failed to save X Shopping settings" });
  }
});

router.post("/settings/x-shopping/verify", async (req: Request, res: Response) => {
  try {
    const { xShoppingService } = await import("../../integrations/x-shopping/XShoppingService");
    const result = await xShoppingService.verifyCredentials();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.post("/integrations/x-shopping/sync", async (req: Request, res: Response) => {
  try {
    const { xShoppingService } = await import("../../integrations/x-shopping/XShoppingService");
    const result = await xShoppingService.syncCatalog();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Sync failed" });
  }
});

router.delete("/settings/x-shopping", async (req: Request, res: Response) => {
  try {
    const { xShoppingService } = await import("../../integrations/x-shopping/XShoppingService");
    await storage.updateIntegrationSettings({
      xShoppingConfigured: false,
      xAccountId: null,
      xCatalogId: null,
      xClientId: null,
      xClientSecretEncrypted: null,
      xAccessTokenEncrypted: null,
      xRefreshTokenEncrypted: null,
      xLastSyncAt: null,
      xLastSyncStatus: "never",
    });
    xShoppingService.clearCache();
    console.log(`[Audit] X Shopping settings removed by admin`);
    res.json({ success: true, message: "X Shopping configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove X Shopping settings" });
  }
});

// ==================== MAILCHIMP INTEGRATION ====================

router.get("/settings/mailchimp", async (req: Request, res: Response) => {
  try {
    const integrationSettings = await storage.getIntegrationSettings();
    res.json({
      configured: integrationSettings?.mailchimpConfigured || false,
      serverPrefix: integrationSettings?.mailchimpServerPrefix || null,
      audienceId: integrationSettings?.mailchimpAudienceId || null,
      hasApiKey: !!integrationSettings?.mailchimpApiKeyEncrypted,
      lastSyncAt: integrationSettings?.mailchimpLastSyncAt || null,
      lastSyncStatus: integrationSettings?.mailchimpLastSyncStatus || "never",
      updatedAt: integrationSettings?.updatedAt || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Mailchimp settings" });
  }
});

router.patch("/settings/mailchimp", async (req: Request, res: Response) => {
  try {
    const { encrypt } = await import("../../utils/encryption");
    const { mailchimpService } = await import("../../integrations/mailchimp/MailchimpService");
    const { apiKey, serverPrefix, audienceId } = req.body;

    const existingSettings = await storage.getIntegrationSettings();
    const isUpdate = existingSettings?.mailchimpConfigured;

    if (!isUpdate && (!apiKey || !serverPrefix || !audienceId)) {
      return res.status(400).json({ message: "API Key, Server Prefix, and Audience ID are required" });
    }

    const updateData: any = {
      mailchimpConfigured: true,
    };

    if (apiKey) updateData.mailchimpApiKeyEncrypted = encrypt(apiKey);
    if (serverPrefix) updateData.mailchimpServerPrefix = serverPrefix;
    if (audienceId) updateData.mailchimpAudienceId = audienceId;

    await storage.updateIntegrationSettings(updateData);
    mailchimpService.clearCache();

    console.log(`[Audit] Mailchimp settings updated by admin`);
    res.json({ success: true, message: "Mailchimp configuration saved" });
  } catch (error: any) {
    console.error("Error saving Mailchimp settings:", error);
    res.status(500).json({ message: error.message || "Failed to save Mailchimp settings" });
  }
});

router.post("/settings/mailchimp/verify", async (req: Request, res: Response) => {
  try {
    const { mailchimpService } = await import("../../integrations/mailchimp/MailchimpService");
    const result = await mailchimpService.verifyCredentials();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Verification failed" });
  }
});

router.delete("/settings/mailchimp", async (req: Request, res: Response) => {
  try {
    const { mailchimpService } = await import("../../integrations/mailchimp/MailchimpService");
    await storage.updateIntegrationSettings({
      mailchimpConfigured: false,
      mailchimpApiKeyEncrypted: null,
      mailchimpServerPrefix: null,
      mailchimpAudienceId: null,
      mailchimpLastSyncAt: null,
      mailchimpLastSyncStatus: "never",
    });
    mailchimpService.clearCache();
    console.log(`[Audit] Mailchimp settings removed by admin`);
    res.json({ success: true, message: "Mailchimp configuration removed" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to remove Mailchimp settings" });
  }
});

export default router;
