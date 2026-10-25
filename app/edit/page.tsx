import { notFound } from "next/navigation";
import PortfolioEditor from "@/components/PortfolioEditor";

export default function EditPortfolioPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <PortfolioEditor />;
}
