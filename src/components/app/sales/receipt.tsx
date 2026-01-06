import { forwardRef } from "react"

type Props = {
  paper: "58mm" | "80mm"
}

const widths = {
  "58mm": "219px",
  "80mm": "302px",
}

const Receipt = forwardRef<HTMLDivElement, Props>(
  ({ paper }, ref) => {
    return (
      <div
        ref={ref}
        id="print-area"
        className="bg-white text-black font-mono mx-auto"
        style={{ width: widths[paper] }}
      >
        <div className="p-2 text-[12px]">

          <div className="text-center font-bold uppercase">
            EMPRESA EXEMPLO LTDA
          </div>

          <div className="text-center text-[10px] leading-tight">
            CNPJ: 12.345.678/0001-99<br />
            Rua Exemplo, 123 – Centro
          </div>

          <div className="border-t border-dashed border-black my-2" />

          <div className="text-[10px]">
            Venda Nº 123<br />
            Data: 06/01/2026 11:10
          </div>

          <div className="border-t border-dashed border-black my-2" />

          {[{ name: "Produto A", qty: 1, price: 10 }].map((item, i) => (
            <div key={i} className="text-[10px] mt-1">
              {item.name}
              <div className="flex justify-between pl-2">
                <span>{item.qty} x {item.price}</span>
                <span>{(item.qty * item.price).toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="border-t border-dashed border-black my-2" />

          <div className="flex justify-between font-bold text-[14px]">
            <span>TOTAL</span>
            <span>R$ 10,00</span>
          </div>

          <div className="text-center text-[10px] mt-2">
            Documento sem valor fiscal
          </div>

        </div>
      </div>
    )
  }
)

Receipt.displayName = "Receipt"

export default Receipt
