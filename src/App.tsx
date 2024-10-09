import React, { useState } from 'react'
import { Download } from 'lucide-react'
import WorkoutList from './components/WorkoutList'
import { Workout } from './types'

function App() {
  const [url, setUrl] = useState('https://whatsonzwift.com/workouts/gravel-grinder')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScrape = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('Sending request to scrape:', url);
      const response = await fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }
      const scrapedWorkouts = await response.json()
      console.log('Received workouts:', scrapedWorkouts);
      setWorkouts(scrapedWorkouts)
    } catch (err) {
      console.error('Error in handleScrape:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const jsonString = JSON.stringify(workouts, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = 'workouts.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Workout Scraper</h1>
        <div className="mb-6 flex">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter URL to scrape"
          />
          <button
            onClick={handleScrape}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Scraping...' : 'Scrape'}
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        {workouts.length > 0 && (
          <div className="mb-6">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
            >
              <Download size={20} className="mr-2" />
              Download JSON
            </button>
          </div>
        )}
        <WorkoutList workouts={workouts} />
      </div>
    </div>
  )
}

export default App