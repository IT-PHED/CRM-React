import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";


interface DatePickerProps {
  date?: string; // ISO String
  setDate: (date: string | undefined) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({
  date,
  setDate,
  label,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)} ref={containerRef}>
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-start rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
          {date ? format(new Date(date), "PPP") : <span>{placeholder}</span>}
        </button>

        {date && (
          <button
            onClick={() => setDate(undefined)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        )}

        {isOpen && (
          <div className="absolute z-50 mt-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg outline-none animate-in fade-in zoom-in-95">
            <input
              type="date"
              className="p-2 text-sm focus:outline-none"
              value={date ? format(new Date(date), "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const val = e.target.value;
                setDate(val ? new Date(val).toISOString() : undefined);
                setIsOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};