import { useSelector } from 'react-redux'
import UploadScreen from './components/UploadScreen'
import ChatScreen from './components/ChatScreen'

export default function App() {
  const isUploaded = useSelector((state) => state.pdf.isUploaded)

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {isUploaded ? <ChatScreen /> : <UploadScreen />}
    </main>
  )
}