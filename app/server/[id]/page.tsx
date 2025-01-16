import ServerView from '@/app/components/server/ServerView'
import { getServerById, getMessagesForServer } from '@/lib/mockData'
import { AppProvider } from '@/app/contexts/AppContext'

interface PageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: PageProps) {
  const server = getServerById(params.id)
  const messages = getMessagesForServer(params.id)
  const currentUserId = '1' // This should be dynamically set based on the logged-in user

  if (!server) {
    return <div>Server not found</div>
  }

  return (
    <AppProvider>
      <ServerView server={server} initialMessages={messages} currentUserId={currentUserId} />
    </AppProvider>
  )
}

