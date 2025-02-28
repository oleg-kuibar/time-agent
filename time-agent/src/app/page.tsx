import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  
  // Redirect to dashboard if authenticated, otherwise to sign-in
  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/signin");
  }
}
