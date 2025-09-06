import './globals.css'

export const metadata = {
  title: 'Quantum Geometry',
  description: 'Retrocausal trading interface',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Prevent MetaMask from trying to connect to this Solana app */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Block MetaMask injection
              if (typeof window !== 'undefined') {
                window.ethereum = undefined;
                window.web3 = undefined;
                // Prevent MetaMask from detecting this as a web3 site
                Object.defineProperty(window, 'ethereum', {
                  get: () => undefined,
                  set: () => {},
                  configurable: false
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <div id="app">{children}</div>
      </body>
    </html>
  )
}
