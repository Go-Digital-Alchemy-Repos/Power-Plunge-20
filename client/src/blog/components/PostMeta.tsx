import { Calendar, Clock } from "lucide-react";

interface PostMetaProps {
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
  compact?: boolean;
}

export default function PostMeta({ publishedAt, readingTimeMinutes, compact }: PostMetaProps) {
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: compact ? "short" : "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex items-center gap-3 text-slate-400 text-sm" data-testid="post-meta">
      {formattedDate && (
        <span className="flex items-center gap-1" data-testid="post-meta-date">
          <Calendar className="w-3.5 h-3.5" />
          {formattedDate}
        </span>
      )}
      {readingTimeMinutes != null && readingTimeMinutes > 0 && (
        <span className="flex items-center gap-1" data-testid="post-meta-reading-time">
          <Clock className="w-3.5 h-3.5" />
          {readingTimeMinutes} min read
        </span>
      )}
    </div>
  );
}
