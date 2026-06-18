import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Common Ground — Friends and activities, close to home",
  description:
    "Find friendly local get-togethers — cards, knitting, dominoes, walks and more — with neighbors who share your interests.",
};

// Senior-first: prevent tiny zoom but allow users to scale up.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let firstName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    firstName = profile?.name?.split(" ")[0] || "You";
  }

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        <Nav signedIn={!!user} firstName={firstName} />
        <main id="main">{children}</main>
        <footer className="site">
          <div className="wrap">
            <div className="cols">
              <div>
                <div className="foot-brand">◐ Common Ground</div>
                <p className="foot-tag">Friends and activities, close to home. A friendly place to find local get-togethers.</p>
              </div>
              <div className="foot-col">
                <h4>Explore</h4>
                <Link href="/browse">Find Activities</Link>
                <Link href="/post">Post an Activity</Link>
                <Link href="/pricing">Pricing</Link>
              </div>
              <div className="foot-col">
                <h4>Learn</h4>
                <Link href="/how-it-works">How it works</Link>
                <Link href="/faq">FAQs</Link>
                <Link href="/about">About</Link>
              </div>
              <div className="foot-col">
                <h4>Help</h4>
                <Link href="/contact">Contact</Link>
                <Link href="/safety">Staying safe</Link>
              </div>
            </div>
            <div className="copyright">
              © 2026 Common Ground (working name) &nbsp;·&nbsp; Powered by <strong>Albatech</strong>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
