import type { BlockDefinition, BlockCategory, BlockRenderComponent } from "./types";

const registry = new Map<string, BlockDefinition>();

export function registerBlock(entry: BlockDefinition): void {
  registry.set(entry.type, entry);
}

export function getBlock(type: string): BlockDefinition | undefined {
  return registry.get(type);
}

export function getAllBlocks(): BlockDefinition[] {
  return Array.from(registry.values());
}

export function getBlocksByCategory(category: BlockCategory): BlockDefinition[] {
  return getAllBlocks().filter((b) => b.category === category);
}

export function getBlockTypes(): string[] {
  return Array.from(registry.keys());
}

export function getBlockComponent(type: string): BlockRenderComponent | undefined {
  return registry.get(type)?.renderComponent;
}

export function isRegistered(type: string): boolean {
  return registry.has(type);
}

export { registry as cmsBlockRegistry };
