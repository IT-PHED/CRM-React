import { useState } from "react";
import { Search, RotateCcw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onReset: () => void;
  isLoading: boolean;
}

const SearchSection = ({ onSearch, onReset, isLoading }: SearchSectionProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleReset = () => {
    setQuery("");
    onReset();
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Customer Lookup
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Customer No or Meter No"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-11"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} disabled={isLoading || !query.trim()} className="h-11 px-6">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
          <Button variant="outline" onClick={handleReset} className="h-11 px-4">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
