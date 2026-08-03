import { useState, useRef, useEffect, useCallback, forwardRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

const LocationAutocomplete = forwardRef<HTMLInputElement, LocationAutocompleteProps>(
  ({ value, onChange, className, placeholder = "Search for a location..." }, ref) => {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const search = useCallback(async (q: string) => {
      if (q.length < 3) {
        setResults([]);
        setOpen(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=0`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleInput = (val: string) => {
      setQuery(val);
      onChange(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(val), 350);
    };

    const handleSelect = (result: NominatimResult) => {
      setQuery(result.display_name);
      onChange(result.display_name);
      setOpen(false);
      setResults([]);
    };

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--sidebar-foreground))]/30 pointer-events-none" />
          <input
            ref={ref}
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            className={`pl-9 ${className || ""}`}
          />
          {loading && (
            <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[hsl(var(--sidebar-foreground))]/30" />
          )}
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-50 mt-1 w-full rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelect(r)}
                  className="w-full text-left px-3 py-2.5 text-sm text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-colors flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[hsl(var(--sidebar-foreground))]/40" />
                  <span className="line-clamp-2">{r.display_name}</span>
                </button>
              </li>
            ))}
            <li className="px-3 py-1.5 text-[10px] text-[hsl(var(--sidebar-foreground))]/20 text-right">
              © OpenStreetMap contributors
            </li>
          </ul>
        )}
      </div>
    );
  }
);

LocationAutocomplete.displayName = "LocationAutocomplete";

export default LocationAutocomplete;
