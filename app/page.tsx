import Link from 'next/link'
import { Car, Users, ClipboardList } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Insurance Co-Pilot
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          AI-powered roadside assistance claim system with voice interaction and real-time processing
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Link href="/customer" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <Car className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Customer Interface</h2>
            <p className="text-gray-600">
              File roadside assistance claims using voice interaction
            </p>
          </div>
        </Link>

        <Link href="/agent" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Agent Dashboard</h2>
            <p className="text-gray-600">
              Monitor and manage customer claims in real-time
            </p>
          </div>
        </Link>

        <Link href="/status" className="card hover:shadow-md transition-shadow">
          <div className="text-center">
            <ClipboardList className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Claim Status</h2>
            <p className="text-gray-600">
              Track the progress of your roadside assistance claims
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}