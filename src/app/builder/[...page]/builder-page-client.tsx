"use client";

import { useEffect, useState } from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BUILDER_API_KEY } from "@/lib/builder";

builder.init(BUILDER_API_KEY);

export function BuilderPageClient({ urlPath }: { urlPath: string }) {
  const isPreviewing = useIsPreviewing();
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    builder
      .get("page", { userAttributes: { urlPath } })
      .toPromise()
      .then((data) => { setContent(data ?? null); setLoading(false); });
  }, [urlPath]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--color-ink-3)]">
        Loading…
      </div>
    );
  }

  if (!content && !isPreviewing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
          Page not found in Builder.io
        </h2>
        <p className="mt-3 text-sm text-[var(--color-ink-2)]">
          Create a page at this URL in your Builder.io space, then publish it.
        </p>
      </div>
    );
  }

  return (
    <BuilderComponent
      model="page"
      content={content ?? undefined}
      apiKey={BUILDER_API_KEY}
    />
  );
}
