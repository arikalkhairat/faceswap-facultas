/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles } from 'lucide-react'
import LiveCamera from './LiveCamera'
import BackgroundSelection from './BackgroundSelection'
import FaceSwapPreview from './FaceSwapPreview'

const majors = [
  { value: "cs", label: "Computer Science", icon: "💻" },
  { value: "bio", label: "Biology", icon: "🧬" },
  { value: "math", label: "Mathematics", icon: "🔢" },
  { value: "art", label: "Art", icon: "🎨" },
  { value: "physics", label: "Physics", icon: "⚛️" },
]

const API_KEY = "c4ec61f4b95b9f40e66525aba51eeaffb60b511bf7d6b4e387b675e9aedeff57"

export default function UserDashboard() {
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null)
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)

    const myHeaders = new Headers();
    myHeaders.append("x-api-key", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "model": "Qubico/image-toolkit",
      "task_type": "face-swap",
      "input": {
        "target_image": selectedBackground,
        "swap_image": "https://i.ibb.co/m9BFL9J/ad61a39afd9079e57a5908c0bd9dd995.jpg" // This should be the user's face image
      }
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect
    };

    try {
      const response = await fetch("https://api.piapi.ai/api/v1/task", requestOptions)
      const result = await response.json()
      if (result.task_id) {
        setTaskId(result.task_id)
        checkTaskStatus(result.task_id)
      } else {
        throw new Error('No task ID in the response')
      }
    } catch (error) {
      console.error('error', error)
      setError('Failed to start face swap task. Please try again.')
      setIsLoading(false)
    }
  }

  const checkTaskStatus = async (id: string) => {
    const myHeaders = new Headers();
    myHeaders.append("x-api-key", API_KEY);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow' as RequestRedirect
    };

    try {
      const response = await fetch(`https://api.piapi.ai/api/v1/task/${id}`, requestOptions)
      const result = await response.json()
      setTaskStatus(result.status)

      if (result.status === 'completed' && result.output && result.output.image) {
        setGeneratedImage(result.output.image)
        setIsLoading(false)
      } else if (result.status === 'failed') {
        setError('Face swap task failed. Please try again.')
        setIsLoading(false)
      } else {
        // If the task is still processing, check again after 2 seconds
        setTimeout(() => checkTaskStatus(id), 2000)
      }
    } catch (error) {
      console.error('error', error)
      setError('Failed to check task status. Please try again.')
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setGeneratedImage(null)
    setSelectedMajor(null)
    setSelectedBackground(null)
    setTaskId(null)
    setTaskStatus(null)
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="bg-[#F0F8FF] text-[#2F4F4F]">
        <CardTitle>Live Face Swap</CardTitle>
        <CardDescription className="text-[#4682B4]">Transform your look in real-time!</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="camera">
          <TabsList className="grid w-full grid-cols-2 bg-[#F0F8FF]">
            <TabsTrigger value="camera" className="data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white">Live Camera</TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedImage} className="data-[state=active]:bg-[#1E90FF] data-[state=active]:text-white">Result</TabsTrigger>
          </TabsList>
          <TabsContent value="camera">
            <div className="space-y-4">
              <LiveCamera />
              <Select onValueChange={(value) => setSelectedMajor(value)}>
                <SelectTrigger className="bg-white border-[#4682B4]">
                  <SelectValue placeholder="Select your major" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.value} value={major.value}>
                      {major.icon} {major.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <BackgroundSelection onBackgroundSelected={setSelectedBackground} />
              <Button
                onClick={handleGenerate}
                className="w-full bg-[#1E90FF] text-white hover:bg-[#4682B4]"
                disabled={!selectedMajor || !selectedBackground || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> {taskStatus || 'Processing...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Face Swap
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="result">
            {generatedImage && (
              <FaceSwapPreview
                image={generatedImage}
                onDownload={() => console.log("Downloading...")}
                onShare={() => console.log("Sharing...")}
                onReset={handleReset}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

