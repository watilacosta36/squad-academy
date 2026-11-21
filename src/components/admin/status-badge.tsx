import { Badge } from "@/components/ui/badge";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  type ContentStatus,
} from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const key = (status in STATUS_LABELS ? status : "DRAFT") as ContentStatus;

  return <Badge className={STATUS_BADGE_CLASSES[key]}>{STATUS_LABELS[key]}</Badge>;
}
