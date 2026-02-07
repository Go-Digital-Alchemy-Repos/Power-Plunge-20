#!/usr/bin/env npx tsx
import { validateContentJson, sanitizeHtml } from "../../server/src/utils/contentValidation";

let pass = 0;
let fail = 0;

function assert(label: string, ok: boolean, detail?: string) {
  if (ok) {
    pass++;
    console.log(`PASS  ${label}`);
  } else {
    fail++;
    console.log(`FAIL  ${label}${detail ? " — " + detail : ""}`);
  }
}

console.log("=== contentJson Validation ===\n");

{
  const r = validateContentJson(null);
  assert("null contentJson is valid (becomes empty blocks)", r.valid === true);
}

{
  const r = validateContentJson({ blocks: [] });
  assert("empty blocks array is valid", r.valid === true);
}

{
  const r = validateContentJson("not an object");
  assert("string rejected", r.valid === false);
}

{
  const r = validateContentJson([1, 2, 3]);
  assert("array rejected", r.valid === false);
}

{
  const r = validateContentJson({ noBlocks: true });
  assert("missing blocks key rejected", r.valid === false);
}

{
  const r = validateContentJson({ blocks: [{ id: "b1", type: "hero", data: { title: "Hi" } }] });
  assert("valid block accepted", r.valid === true);
}

{
  const r = validateContentJson({ blocks: [{ id: "", type: "hero", data: {} }] });
  assert("empty id rejected", r.valid === false);
}

{
  const r = validateContentJson({ blocks: [{ id: "b1", type: "", data: {} }] });
  assert("empty type rejected", r.valid === false);
}

{
  const r = validateContentJson({ blocks: [{ id: "b1", type: "hero", data: "not-obj" }] });
  assert("data as string rejected", r.valid === false);
}

{
  const r = validateContentJson({
    blocks: [{ id: "b1", type: "totallyFakeWidget", data: { x: 1 } }],
  });
  assert("unknown block type accepted (does not crash)", r.valid === true);
  if (r.valid) {
    assert("unknown block type produces warning", r.warnings.length > 0 && r.warnings[0].includes("totallyFakeWidget"));
  }
}

{
  const r = validateContentJson({
    blocks: [
      { id: "b1", type: "hero", data: {} },
      { id: "b2", type: "unknownWidget", data: {} },
      { id: "b3", type: "cta", data: {} },
    ],
  });
  assert("mixed known + unknown blocks accepted", r.valid === true);
  if (r.valid) {
    assert("only unknown block produces warning (known blocks do not)", r.warnings.length === 1);
  }
}

console.log("\n=== HTML Sanitization ===\n");

{
  const input = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
  const result = sanitizeHtml(input);
  assert("script tags removed", !result.includes("<script") && !result.includes("</script"));
  assert("safe content preserved after script removal", result.includes("<p>Hello</p>") && result.includes("<p>World</p>"));
}

{
  const input = '<div onclick="alert(1)" onmouseover="hack()">text</div>';
  const result = sanitizeHtml(input);
  assert("event handlers removed", !result.includes("onclick") && !result.includes("onmouseover"));
  assert("element preserved after handler removal", result.includes("<div") && result.includes("text"));
}

{
  const input = '<a href="javascript:alert(1)">click</a>';
  const result = sanitizeHtml(input);
  assert("javascript: URI neutralized", !result.includes("javascript:"));
  assert("link element preserved", result.includes("<a") && result.includes("click"));
}

{
  const input = "<h1>Title</h1><p>Safe <strong>content</strong></p>";
  const result = sanitizeHtml(input);
  assert("safe HTML passes through unchanged", result === input);
}

{
  const input = '<script>alert(1)</script><script type="text/javascript">hack()</script>';
  const result = sanitizeHtml(input);
  assert("multiple script tags removed", !result.includes("<script") && result.trim() === "");
}

console.log(`\n=== Results: ${pass} passed, ${fail} failed ===`);
process.exit(fail > 0 ? 1 : 0);
