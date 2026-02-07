import { Router } from "express";
import { storage } from "../../../storage";
import { passwordResetLimiter } from "../../middleware/rate-limiter";

const router = Router();

router.get("/orders", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const customer = await storage.getCustomerByUserId(userId);
    if (!customer) {
      return res.json({ orders: [] });
    }
    const orders = await storage.getOrdersByCustomerId(customer.id);
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        const shipments = await storage.getShipments(order.id);
        return { ...order, items, shipments };
      })
    );
    
    res.json({ customer, orders: ordersWithItems });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const customer = await storage.getCustomerByUserId(userId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    const order = await storage.getOrder(req.params.id);
    if (!order || order.customerId !== customer.id) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const items = await storage.getOrderItems(order.id);
    const shipments = await storage.getShipments(order.id);
    res.json({ order, items, customer, shipments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

router.post("/link", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { customerId, sessionId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID required" });
    }

    if (sessionId) {
      const order = await storage.getOrderByStripeSession(sessionId);
      if (!order || order.customerId !== customerId) {
        const customer = await storage.getCustomer(customerId);
        const userEmail = req.user.claims.email;
        if (!customer || customer.email.toLowerCase() !== userEmail?.toLowerCase()) {
          return res.status(403).json({ message: "Invalid verification" });
        }
      }
    } else {
      const customer = await storage.getCustomer(customerId);
      const userEmail = req.user.claims.email;
      if (!customer || customer.email.toLowerCase() !== userEmail?.toLowerCase()) {
        return res.status(403).json({ message: "Email mismatch - cannot link customer" });
      }
    }

    const customer = await storage.getCustomer(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.userId && customer.userId !== userId) {
      return res.status(400).json({ message: "Customer already linked to another account" });
    }

    const existingCustomer = await storage.getCustomerByUserId(userId);
    if (existingCustomer && existingCustomer.id !== customerId) {
      const guestOrders = await storage.getOrdersByCustomerId(customerId);
      for (const order of guestOrders) {
        await storage.updateOrder(order.id, { customerId: existingCustomer.id });
      }
      await storage.updateCustomer(customerId, { userId });
      return res.json({ 
        success: true, 
        message: "Orders merged with existing account",
        customerId: existingCustomer.id 
      });
    }

    const updated = await storage.updateCustomer(customerId, { userId });
    res.json({ success: true, customer: updated });
  } catch (error: any) {
    console.error("Error linking customer:", error);
    res.status(500).json({ message: error.message || "Failed to link customer" });
  }
});

router.get("/profile", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    const customer = await storage.getCustomerByUserId(userId);
    
    res.json({
      user: user || null,
      customer: customer || null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

router.patch("/profile", async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } = req.body;
    
    const updatedUser = await storage.updateUser(userId, {
      firstName,
      lastName,
      email,
    });
    
    let customer = await storage.getCustomerByUserId(userId);
    if (customer) {
      customer = await storage.updateCustomer(customer.id, {
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email || customer.email,
        phone: phone || customer.phone,
        address: address || customer.address,
        city: city || customer.city,
        state: state || customer.state,
        zipCode: zipCode || customer.zipCode,
        country: country || customer.country,
      });
    } else {
      customer = await storage.createCustomer({
        userId,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email || updatedUser?.email || '',
        phone,
        address,
        city,
        state,
        zipCode,
        country: country || 'USA',
      });
    }
    
    res.json({
      user: updatedUser,
      customer,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.post("/change-password", passwordResetLimiter, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { currentPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }
    
    res.status(400).json({ 
      message: "Password change is not available for accounts using Google, Apple, or email link sign-in. Please update your password through your identity provider." 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

export default router;
