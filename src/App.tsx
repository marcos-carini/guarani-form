import { Leaf } from "lucide-react"
import { Card, CardHeader } from "./components/ui/card"
import { ModeToggle } from "./components/mode-toggle"



function App() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 dark:from-neutral-950 via-neutral-100 dark:via-neutral-900 to-emerald-100 dark:to-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Guarani Sistemas</h1>
            <ModeToggle/>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}

export default App
