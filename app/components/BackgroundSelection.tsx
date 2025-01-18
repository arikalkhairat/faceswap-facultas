/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const backgrounds = [
  { url: '/placeholder.svg?height=200&width=300', category: 'Lab' },
  { url: '/placeholder.svg?height=200&width=300', category: 'Classroom' },
  { url: '/placeholder.svg?height=200&width=300', category: 'Outdoors' },
  { url: '/placeholder.svg?height=200&width=300', category: 'Lab' },
  { url: '/placeholder.svg?height=200&width=300', category: 'Classroom' },
]

interface BackgroundSelectionProps {
  onBackgroundSelected: (background: string) => void
}

export default function BackgroundSelection({ onBackgroundSelected }: BackgroundSelectionProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  const handleSelect = (index: number) => {
    setSelected(index)
    onBackgroundSelected(backgrounds[index].url)
  }

  const filteredBackgrounds = category
    ? backgrounds.filter(bg => bg.category === category)
    : backgrounds

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300">
        <div className="flex w-max space-x-4 p-4">
          <Button
            variant={category === null ? "default" : "outline"}
            onClick={() => setCategory(null)}
            className="bg-gray-200 text-[#2F4F4F] hover:bg-gray-300 data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white"
          >
            All
          </Button>
          <Button
            variant={category === "Lab" ? "default" : "outline"}
            onClick={() => setCategory("Lab")}
            className="bg-gray-200 text-[#2F4F4F] hover:bg-gray-300 data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white"
          >
            Lab
          </Button>
          <Button
            variant={category === "Classroom" ? "default" : "outline"}
            onClick={() => setCategory("Classroom")}
            className="bg-gray-200 text-[#2F4F4F] hover:bg-gray-300 data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white"
          >
            Classroom
          </Button>
          <Button
            variant={category === "Outdoors" ? "default" : "outline"}
            onClick={() => setCategory("Outdoors")}
            className="bg-gray-200 text-[#2F4F4F] hover:bg-gray-300 data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white"
          >
            Outdoors
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-300">
          <div className="flex w-max space-x-4 p-4">
            {filteredBackgrounds.map((bg, index) => (
              <Card
                key={index}
                className={`flex-shrink-0 cursor-pointer transition-all ${selected === index ? 'ring-2 ring-[#1E90FF]' : ''
                  }`}
                onClick={() => handleSelect(index)}
              >
                <CardContent className="p-0">
                  <img src={bg.url || "/placeholder.svg"} alt={`Background ${index + 1}`} className="w-48 h-32 object-cover rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}

