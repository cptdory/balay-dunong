import { Toaster } from "sileo";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>
  <Toaster position="bottom-right" theme="dark" />
  {children}</>;
}
