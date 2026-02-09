import { Request } from "express";

function getAllowedHosts(): Set<string> {
  const hosts = new Set<string>();

  if (process.env.REPLIT_DOMAINS) {
    for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
      const trimmed = domain.trim();
      if (trimmed) hosts.add(trimmed);
    }
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    hosts.add(process.env.REPLIT_DEV_DOMAIN.trim());
  }
  if (process.env.BASE_URL) {
    try {
      const parsed = new URL(process.env.BASE_URL);
      hosts.add(parsed.host);
    } catch {}
  }

  hosts.add("localhost:5000");
  hosts.add("localhost");
  hosts.add("0.0.0.0:5000");

  return hosts;
}

export function getBaseUrl(req: Request): string {
  const allowedHosts = getAllowedHosts();
  const requestHost = (req.headers["x-forwarded-host"] as string) || req.headers.host;

  if (requestHost && allowedHosts.has(requestHost)) {
    const protocol = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    return `${protocol}://${requestHost}`;
  }

  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (process.env.REPLIT_DOMAINS) {
    return `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`;
  }
  return "https://localhost:5000";
}

export function getStaticBaseUrl(): string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  if (process.env.REPLIT_DOMAINS) {
    return `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`;
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  }
  return "https://localhost:5000";
}
