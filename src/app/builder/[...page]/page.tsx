import { Header, Footer } from "@/components/chrome";
import { BuilderPageClient } from "./builder-page-client";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ page: string[] }>;
};

export default async function BuilderPage({ params }: Props) {
  const { page } = await params;
  const urlPath = "/" + (page?.join("/") ?? "");

  return (
    <>
      <Header />
      <main>
        <BuilderPageClient urlPath={urlPath} />
      </main>
      <Footer />
    </>
  );
}
