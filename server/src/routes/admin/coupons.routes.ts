import { Router, Request, Response } from "express";
import { storage } from "../../../storage";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const coupons = await storage.getCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const coupon = await storage.createCoupon(req.body);
    res.json(coupon);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    res.status(500).json({ message: "Failed to create coupon" });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const coupon = await storage.updateCoupon(req.params.id, req.body);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to update coupon" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await storage.deleteCoupon(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
});

const publicCouponRoutes = Router();

publicCouponRoutes.post("/validate", async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await storage.getCouponByCode(code);
    
    if (!coupon) {
      return res.status(404).json({ valid: false, message: "Invalid coupon code" });
    }
    
    if (!coupon.active) {
      return res.status(400).json({ valid: false, message: "This coupon is no longer active" });
    }
    
    if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
      return res.status(400).json({ valid: false, message: "This coupon has expired" });
    }
    
    if (coupon.startDate && new Date(coupon.startDate) > new Date()) {
      return res.status(400).json({ valid: false, message: "This coupon is not yet active" });
    }
    
    if (coupon.maxRedemptions && coupon.timesUsed >= coupon.maxRedemptions) {
      return res.status(400).json({ valid: false, message: "This coupon has reached its usage limit" });
    }
    
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ 
        valid: false, 
        message: `Minimum order amount of $${(coupon.minOrderAmount / 100).toFixed(2)} required` 
      });
    }
    
    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round(orderAmount * (coupon.value / 100));
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
    } else if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    }
    
    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discountAmount,
        blockAffiliateCommission: coupon.blockAffiliateCommission || false,
        blockVipDiscount: coupon.blockVipDiscount || false,
        minMarginPercent: coupon.minMarginPercent || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});

export { publicCouponRoutes };
export default router;
