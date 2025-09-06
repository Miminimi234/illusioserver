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
        {/* Mobile gate fallback - only shows if CSS media query triggers */}
        <div id="mobileGate">
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 9999
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '400px',
              color: 'white',
              fontFamily: 'monospace'
            }}>
              <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>FUTURE</h1>
              <p style={{ marginBottom: '16px', color: '#ccc' }}>Mobile version coming soon</p>
              <p style={{ fontSize: '14px', color: '#888' }}>Please visit on desktop for the full experience</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
