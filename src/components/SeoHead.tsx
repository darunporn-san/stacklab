import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
}

export function SeoHead({ title, description, canonical }: SeoHeadProps) {
  const fullTitle = `${title} | DevToolbox`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
