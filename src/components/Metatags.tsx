import Head from 'next/head';

export default function Metatags({
  title = '',
  description = 'Quiz Me Academically',
  image = '',
}) {
  const displayedTitle = `${title} | Quiz Me Academically`;
  return (
    <Head>
      <title>{displayedTitle}</title>

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}