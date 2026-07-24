import '../src/index.css';
import { Metadata } from 'next';
import { RouteGuard } from '../components/RouteGuard';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Pahadi-CropSathi | AgriVision AI',
  description: 'AI-powered crop health diagnostic & market intelligence platform for farmers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free@2.20.0/dist/leaflet-geoman.css" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <RouteGuard>
            {children}
          </RouteGuard>
        </ErrorBoundary>
      </body>
    </html>
  );
}
