import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel — Sector1 Race Control',
};

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {children}
    </div>
  );
}
