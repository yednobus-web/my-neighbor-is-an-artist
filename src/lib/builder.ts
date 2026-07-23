// Builder.io SDK registration.
// Import this once (in layout or a page) before using <BuilderComponent>.
import { builder } from "@builder.io/react";

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

builder.init(BUILDER_API_KEY);

export { BUILDER_API_KEY };
