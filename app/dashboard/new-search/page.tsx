import { redirect } from "next/navigation";

export default function LegacyNewSearchPage() {
  redirect("/dashboard/searches/new");
}
