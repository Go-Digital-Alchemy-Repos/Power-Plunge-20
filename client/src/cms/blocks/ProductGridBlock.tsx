import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlockRenderProps } from "./types";

interface Product {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  price: number;
  salePrice?: number;
  primaryImage?: string;
  tags?: string[];
}

const gridColsMap: Record<number, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function ProductGridBlock({ data, settings, onAddToCart }: BlockRenderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const title = data?.title || "";
  const queryMode = data?.queryMode || data?.mode || "all";
  const productIds = data?.productIds || [];
  const collectionTag = data?.collectionTag || "";
  const columns = data?.columns || 3;
  const showPrice = data?.showPrice !== false;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((prods) => {
        setProducts(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getDisplayProducts = (): Product[] => {
    if (queryMode === "ids" && productIds.length > 0) {
      return products.filter((p) => productIds.includes(p.id));
    }
    if (queryMode === "tag" && collectionTag) {
      return products.filter(
        (p) => p.tags && p.tags.includes(collectionTag)
      );
    }
    return products.slice(0, data?.limit || 12);
  };

  const displayProducts = getDisplayProducts();

  if (loading) {
    return (
      <section
        className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
        data-testid="block-productgrid"
      >
        <div className={cn("grid grid-cols-1 gap-6", gridColsMap[columns])}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-slate-800 rounded-lg h-64"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn("max-w-7xl mx-auto px-4 py-12", settings?.className)}
      data-testid="block-productgrid"
    >
      {title && (
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {title}
        </h2>
      )}
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          gridColsMap[columns] || "md:grid-cols-3"
        )}
      >
        {displayProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
          >
            {product.primaryImage && (
              <img
                src={product.primaryImage}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-white mb-2">
              {product.name}
            </h3>
            {product.tagline && (
              <p className="text-slate-400 text-sm mb-3">{product.tagline}</p>
            )}
            {showPrice && (
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-cyan-400">
                  $
                  {(
                    (product.salePrice || product.price) / 100
                  ).toLocaleString()}
                </span>
                {onAddToCart && (
                  <Button
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600 text-black"
                    onClick={() => onAddToCart(product.id, 1)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
