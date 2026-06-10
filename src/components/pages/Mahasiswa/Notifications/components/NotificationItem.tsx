import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { Notification } from "@/types/notification";
import { Icon } from "@iconify/react";
import { formatRelativeTime, getNotificationMeta } from "../utils";

type NotificationItemProps = {
  notification: Notification;
  variant?: "compact" | "full";
  onClick: (notification: Notification) => void;
  onDelete?: (id: string) => void;
};

const NotificationItem = ({
  notification,
  variant = "full",
  onClick,
  onDelete,
}: NotificationItemProps) => {
  const meta = getNotificationMeta(notification.tipe);
  const isCompact = variant === "compact";
  console.log("data", notification);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(notification)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(notification);
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer items-start gap-3 border-b border-black/5 px-3 py-3 text-left transition-colors hover:bg-muted/60 focus:outline-none focus-visible:bg-muted/60",
        !notification.isRead && "bg-primary/5",
      )}
    >
      {/* indikator belum dibaca */}
      {!notification.isRead && (
        <span
          className="absolute left-1 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden
        />
      )}

      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
          meta.iconClassName,
        )}
      >
        <Icon icon={meta.icon} width={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "truncate text-sm",
              notification.isRead
                ? "font-medium text-foreground/80"
                : "font-semibold text-foreground",
            )}
          >
            {notification.judul}
          </p>
          {!isCompact && (
            <Badge variant={meta.badgeVariant} className="shrink-0">
              {meta.label}
            </Badge>
          )}
        </div>

        <p
          className={cn(
            "mt-0.5 text-xs text-foreground/70",
            isCompact ? "line-clamp-2" : "line-clamp-3",
          )}
        >
          {notification.pesan}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-foreground/50">
          {notification.course && (
            <span className="font-medium text-foreground/60">
              {notification.course.kodeMatkul}
            </span>
          )}
          {notification.sisaWaktu && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <Icon icon="mdi:timer-sand" width={12} />
              {notification.sisaWaktu}
            </span>
          )}
          <span>{formatRelativeTime(notification.createdAt)}</span>
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          aria-label="Hapus notifikasi"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className="shrink-0 rounded p-1 text-foreground/40 opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Icon icon="mdi:close" width={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
