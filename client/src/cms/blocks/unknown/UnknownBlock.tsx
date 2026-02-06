import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

interface UnknownBlockProps {
  data: Record<string, any>;
  blockType: string;
}

export default function UnknownBlock({ data, blockType }: UnknownBlockProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-8"
      data-testid={`block-unknown-${blockType}`}
    >
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-yellow-300 font-medium">
              Unknown block type:{" "}
              <code className="bg-yellow-900/30 px-1.5 py-0.5 rounded text-sm">
                {blockType}
              </code>
            </p>
            <p className="text-yellow-400/60 text-sm mt-1">
              This block type is not registered. It may have been removed or renamed.
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-yellow-400/60 hover:text-yellow-400 transition-colors p-1"
            data-testid={`unknown-block-toggle-${blockType}`}
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
        {expanded && (
          <pre
            className="mt-4 p-3 bg-black/30 rounded text-xs text-yellow-300/70 overflow-x-auto max-h-60"
            data-testid={`unknown-block-json-${blockType}`}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
