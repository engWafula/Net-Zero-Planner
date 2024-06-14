import AuthHeader from "../components/AuthHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <AuthHeader/>
      {children}
    </main>
  );
}
