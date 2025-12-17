
"use client"
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

function Edit() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleBack() {
    router.push(`/app/customers?${searchParams.toString()}`)
  }
  return (
    <div>
      <Button variant="outline" onClick={handleBack}>
        Voltar
      </Button>
    </div>
  )
}

export default Edit