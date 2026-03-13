"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Fuse from "fuse.js";
import searchData from "@/lib/search";

const fuseOptions = {
  keys: ["label", "description", "keywords"],
  threshold: 0.3,
};

const SearchModel = ({ open, setOpen }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const fuse = useMemo(() => new Fuse(searchData, fuseOptions), []);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const found = fuse.search(query, { limit: 8 });
      setResults(found.map((r) => r.item));
    }, 150); // small debounce

    return () => clearTimeout(timeout);
  }, [query, fuse]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Search</DialogTitle>
          <DialogDescription>
            Find and navigate to any admin section instantly.
          </DialogDescription>
        </DialogHeader>

        <Input
          autoFocus
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />

        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {results.map((item) =>
            item.url && item.url !== "#" ? (
              <li key={item.id}>
                <Link
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className="block rounded px-3 py-2 hover:bg-muted"
                >
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </li>
            ) : null
          )}

          {query && results.length === 0 && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              No results found.
            </p>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModel;