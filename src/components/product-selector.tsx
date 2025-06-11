"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductSelectorProps {
  selectedProduct: string
  onSelectProduct: (product: string) => void
}

const products = [
  { id: "aa", name: "Account Aggregator", comingSoon: true },
  { id: "pfm", name: "Personal Finance Management", comingSoon: false },
  { id: "kyc", name: "KYC", comingSoon: true },
  { id: "gst", name: "GST", comingSoon: true },
  { id: "esign", name: "eSign", comingSoon: true },
  { id: "enach", name: "eNACH", comingSoon: true },
  { id: "bbps-bou", name: "BBPS BOU", comingSoon: true },
  { id: "bbps-cou", name: "BBPS COU", comingSoon: true },
]

export default function ProductSelector({ selectedProduct, onSelectProduct }: ProductSelectorProps) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Product Demo Platform</h1>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {products.map((product) => (
          <Button
            key={product.id}
            variant={selectedProduct === product.id ? "default" : "outline"}
            onClick={() => !product.comingSoon && onSelectProduct(product.id)}
            disabled={product.comingSoon}
            className="whitespace-nowrap"
          >
            {product.name}
            {product.comingSoon && (
              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                Coming Soon
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
