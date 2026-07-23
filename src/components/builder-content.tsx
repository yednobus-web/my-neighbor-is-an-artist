"use client";

import { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { BUILDER_API_KEY } from "@/lib/builder";
import "@/lib/builder"; // ensures builder.init() runs

type Props = {
  content: Record<string, unknown> | null;
  model?: string;
};

export function BuilderContent({ content, model = "page" }: Props) {
  const isPreviewing = useIsPreviewing();

  if (!content && !isPreviewing) return null;

  return (
    <BuilderComponent
      model={model}
      content={content ?? undefined}
      apiKey={BUILDER_API_KEY}
    />
  );
}
