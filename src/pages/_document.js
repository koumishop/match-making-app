import Footer from '@/components/Footer'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png"/>
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-chrome-192x192.png"/>
        {/* <link rel="manifest" href="/images/site.webmanifest"/> */}
      </Head>
      <body>
        <Main />
        <Footer/>
        <NextScript />
      </body>
    </Html>
  )
}
