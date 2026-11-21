import { Badge } from "@/components/ui/badge";
import {
  LEVEL_BADGE_CLASSES,
  LEVEL_LABELS,
  type ArticleLevel,
} from "@/lib/constants";

export function LevelBadge({ level }: { level: string }) {
  const key = (level in LEVEL_LABELS ? level : "RECRUTA") as ArticleLevel;

  return (
    <Badge className={LEVEL_BADGE_CLASSES[key]}>{LEVEL_LABELS[key]}</Badge>
  );
}
