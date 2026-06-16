import Link from "next/link";

export function Nav({ signedIn, firstName }: { signedIn: boolean; firstName: string | null }) {
  return (
    <header className="site">
      <div className="wrap nav">
        <Link href="/" className="brand">
          <span className="logo" aria-hidden="true">◐</span>
          <span>Common Ground<small>Close to home</small></span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/browse">Find Activities</Link>
          <Link href="/post">Post an Activity</Link>
          <Link href="/pricing">Pricing</Link>
          {signedIn ? (
            <Link href="/profile">Hi, {firstName}</Link>
          ) : (
            <Link href="/signup">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
