import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Indie+Flower&family=Roboto+Mono:wght@700&family=Roboto:wght@100;400;500;700;900&display=swap" rel="stylesheet" />

        <link rel='shortcut icon' href='favicon.png' type='image/png' />
      </Head>
      <body className='bg-gray-900 text-white lg:text-[93.75%] md:text-[87.5%] text-[87.5%]'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}