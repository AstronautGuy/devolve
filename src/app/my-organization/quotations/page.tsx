import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function QuotationsPage() {
  return (
    <main className={"flex flex-col bg-gray-200 p-3"}>
      <section className={"flex flex-col items-start bg-white px-10"}>
        <Breadcrumb className={"mt-4"}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-organization">
                Components
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Quotations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className={"my-4 text-4xl"}>Quotations</h1>
      </section>
      <section
        className={
          "mt-2 flex flex-row items-center justify-between bg-white px-10"
        }
      >
        <h1 className={"my-4 text-4xl"}>Lifetime Data</h1>
        <ChevronDown />
      </section>
    </main>
  );
}
