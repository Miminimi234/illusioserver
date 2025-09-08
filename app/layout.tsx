import './globals.css'

export const metadata = {
  title: 'Quantum Geometry',
  description: 'Retrocausal trading interface',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash on mobile pages */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent flash on mobile pages */
            body {
              background-color: #000000 !important;
            }
            #app {
              background-color: #000000 !important;
            }
            /* Ensure mobile page is immediately black */
            @media (max-width: 768px) {
              body, #app {
                background-color: #000000 !important;
                color: #ffffff !important;
              }
            }
          `
        }} />
        {/* Immediate script to prevent flash */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Set background immediately to prevent flash
            if (typeof document !== 'undefined') {
              document.documentElement.style.backgroundColor = '#000000';
              document.body.style.backgroundColor = '#000000';
              const app = document.getElementById('app');
              if (app) {
                app.style.backgroundColor = '#000000';
              }
              
              // Add immediate text for mobile users
              if (window.innerWidth <= 768) {
                const textDiv = document.createElement('div');
                textDiv.innerHTML = '<div style="color: #ffffff; font-size: 24px; margin-bottom: 10px; font-family: VT323, monospace;">FUTURE</div><div style="color: #ffffff; font-size: 18px; font-family: VT323, monospace;">FUTURE is currently only available on desktop. Our mobile version is under construction and will be released soon.</div>';
                textDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #000000; z-index: 999999; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;';
                document.body.appendChild(textDiv);
              }
            }
          `
        }} />
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
