import { SeoHead } from "@/components/SeoHead";
import RouteQuerySplitter from "@/tools/RouteQuerySplitter";

export default function RouteQuerySplitterPage() {
  return (
    <>
      <SeoHead
        title="Route & Query Splitter | DevToolbox"
        description="Parse URLs into structured components — extract path parameters, query parameters, protocol, host, and more."
      />
      <RouteQuerySplitter />
    </>
  );
}
