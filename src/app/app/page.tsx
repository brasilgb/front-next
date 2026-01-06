import { SalesModal } from "@/components/app/sales/sales-modal"
import { listCustomers } from "@/lib/actions/customers";
import { listProducts } from "@/lib/actions/products";

export default async function App() {
      const customers = await listCustomers();
      const products = await listProducts();

  return (
    <div className="w-full">
      <SalesModal customers={customers} products={products} />
    </div>
  )
}