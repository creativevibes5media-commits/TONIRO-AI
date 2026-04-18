import { getSession } from "@/lib/auth";
import { Landing } from "@/components/landing";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const session = await getSession();

  if (session) {
    return <Dashboard user={session} />;
  }

  return <Landing />;
}
