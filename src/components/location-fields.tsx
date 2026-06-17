"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { COUNTRIES, CITY_SUGGESTIONS } from "@/lib/locations";

// ─── CityAutocomplete ─────────────────────────────────────────────────────────

export function CityAutocomplete({
  label,
  name,
  placeholder,
  defaultValue = "",
  required,
  isState = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
  isState?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions =
    value.trim().length < 2
      ? []
      : CITY_SUGGESTIONS.filter((s) => {
          const q = value.toLowerCase();
          if (isState) return (s.split(", ")[1] ?? "").toLowerCase().startsWith(q);
          return s.toLowerCase().includes(q);
        }).slice(0, 8);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(s: string) {
    const parts = s.split(", ");
    setValue(isState ? (parts[1] ?? s) : parts[0]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
        {label}
      </label>
      <input
        name={name}
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => { setValue(e.target.value); setOpen(true); }}
        onFocus={() => value.trim().length >= 2 && setOpen(true)}
        className="w-full border-4 border-ink bg-paper p-3 text-ink shadow-graffiti placeholder:text-ink/40 focus:outline-none"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-30 max-h-52 overflow-auto border-4 border-t-0 border-ink bg-paper text-ink shadow-graffiti">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                className="flex w-full items-start gap-1 px-3 py-2 text-left hover:bg-acid-lime"
              >
                <span className="font-[family-name:var(--font-bangers)] tracking-wide">
                  {isState ? s.split(", ")[1] : s.split(", ")[0]}
                </span>
                <span className="ml-1 text-xs text-ink/60">
                  {isState ? s.split(", ")[0] : s.split(", ")[1]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── CountryDropdown ──────────────────────────────────────────────────────────

export function CountryDropdown({
  label,
  name,
  defaultValue = "",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(() =>
    COUNTRIES.find((c) => c.name === defaultValue || c.code === defaultValue) ?? null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  function pick(c: typeof COUNTRIES[0]) {
    setSelected(c); setOpen(false); setSearch("");
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selected?.name ?? ""} />
      <input type="hidden" name="countryFlag" value={selected?.flag ?? "🌍"} />
      <label className="mb-1 block font-[family-name:var(--font-bangers)] tracking-widest text-paper">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between border-4 border-ink bg-paper p-3 text-left text-ink shadow-graffiti focus:outline-none ${
          required && !selected ? "ring-2 ring-hot-pink" : ""
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className="text-xl">{selected.flag}</span>
            <span className="font-[family-name:var(--font-bangers)] tracking-wide">{selected.name}</span>
          </span>
        ) : (
          <span className="text-ink/40">Select country…</span>
        )}
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-4 border-t-0 border-ink bg-paper text-ink shadow-graffiti">
          <div className="border-b-2 border-ink p-2">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries…"
              className="w-full border-2 border-ink bg-paper p-2 text-sm focus:outline-none placeholder:text-ink/40"
            />
          </div>
          <ul className="max-h-52 overflow-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-ink/60">No match</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); pick(c); }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-acid-lime ${
                      selected?.code === c.code ? "bg-acid-lime/40" : ""
                    }`}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="font-[family-name:var(--font-bangers)] tracking-wide">{c.name}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
