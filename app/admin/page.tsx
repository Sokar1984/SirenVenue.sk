import { LoginForm } from "./login-form";

/** Scaffold: a quiet sign-in. What sits behind it is not built yet. */
export default function AdminPage() {
  return (
    <main className="admin-main">
      <img src="/brand/sv-monogram.svg" alt="SirenVenue" className="admin-mark" width={36} height={45} />
      <h1 className="admin-title">Admin</h1>
      <LoginForm />
    </main>
  );
}
