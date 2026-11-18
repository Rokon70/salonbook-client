import ServiceForm from "@/components/ServiceForm";

export const metadata = { title: "Add Service" };
export default function NewServicePage() {
  return (<div><h1 className="mb-6 text-3xl font-semibold">Add service</h1><ServiceForm /></div>);
}
