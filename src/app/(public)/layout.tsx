import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // On laisse le layout racine gérer la Navbar et le Footer globaux
  return <>{children}</>;
}
