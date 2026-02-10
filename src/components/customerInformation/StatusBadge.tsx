import { cn } from "@/lib/utils";

type StatusType = "Active" | "Paid" | "Success" | "Resolved" | "Working" | "Operational"
  | "Pending" | "Open" | "Disconnected" | "Suspended" | "Failed";

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Paid: "bg-success/10 text-success",
  Success: "bg-success/10 text-success",
  Resolved: "bg-success/10 text-success",
  Working: "bg-success/10 text-success",
  Operational: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Open: "bg-warning/10 text-warning",
  Disconnected: "bg-destructive/10 text-destructive",
  Suspended: "bg-destructive/10 text-destructive",
  Failed: "bg-destructive/10 text-destructive",
};

const StatusBadge = ({ status }: { status: StatusType }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status] || "bg-muted text-muted-foreground")}>
    <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full",
      ["Active","Paid","Success","Resolved","Working","Operational"].includes(status) ? "bg-success" :
      ["Pending","Open"].includes(status) ? "bg-warning" : "bg-destructive"
    )} />
    {status}
  </span>
);

export default StatusBadge;
