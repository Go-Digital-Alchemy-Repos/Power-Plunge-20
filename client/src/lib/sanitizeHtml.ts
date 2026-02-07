const SCRIPT_TAG_RE = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi;
const EVENT_HANDLER_RE = /\s+on\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URI_RE = /href\s*=\s*["']javascript:[^"']*["']/gi;

export function sanitizeHtml(html: string): string {
  let result = html;
  result = result.replace(SCRIPT_TAG_RE, "");
  result = result.replace(EVENT_HANDLER_RE, "");
  result = result.replace(JAVASCRIPT_URI_RE, 'href="#"');
  return result;
}
