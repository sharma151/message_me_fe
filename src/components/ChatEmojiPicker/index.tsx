import { useState } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/UI/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs'
// import { MdInsertEmoticon } from 'react-icons/md'
import { RiLoader2Line } from 'react-icons/ri'
import EmojiviewIcon from '@/assets/emojiview.png'

interface ChatPickerProps {
  onSelect: (content: string, type: 'text' | 'gif') => void
}

export const ChatPicker = ({ onSelect }: ChatPickerProps) => {
  const [gifs, setGifs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchGifs = async (query = '') => {
    setLoading(true)
    const API_KEY = 'YOUR_GIPHY_API_KEY' // Replace with your key
    const endpoint = query
      ? `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${query}&limit=12`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=12`

    try {
      const res = await fetch(endpoint)
      const { data } = await res.json()
      setGifs(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer hover:border hover:p-1 hover:rounded-full hover:bg-gray-300 hover:border-gray-500">
          <img src={EmojiviewIcon} alt="Chat" className="w-5.5 h-5.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-80 p-0 border-gray-700 bg-gray-900 shadow-2xl"
      >
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-gray-800 rounded-none border-b border-gray-700">
            <TabsTrigger
              value="emojis"
              className="text-white data-[state=active]:bg-gray-700"
            >
              Emojis
            </TabsTrigger>
            <TabsTrigger
              value="gifs"
              className="text-white data-[state=active]:bg-gray-700"
              onClick={() => fetchGifs()}
            >
              GIFs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emojis" className="m-0 border-none">
            <EmojiPicker
              onEmojiClick={(emoji) => onSelect(emoji.emoji, 'text')}
              theme={Theme.DARK}
              width="100%"
              height="350px"
              previewConfig={{ showPreview: false }}
            />
          </TabsContent>

          <TabsContent
            value="gifs"
            className="p-2 space-y-2 h-87.5 overflow-hidden flex flex-col"
          >
            <input
              placeholder="Search GIFs..."
              className="w-full p-2 text-sm bg-gray-800 text-white rounded border border-gray-700 focus:outline-none"
              onChange={(e) => fetchGifs(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 custom-scrollbar">
              {loading ? (
                <div className="col-span-2 flex justify-center py-10">
                  <RiLoader2Line
                    className="animate-spin text-gray-400"
                    size={24}
                  />
                </div>
              ) : (
                gifs.map((gif: any) => (
                  <img
                    key={gif.id}
                    src={gif.images.fixed_height_small.url}
                    className="cursor-pointer hover:opacity-80 rounded w-full h-24 object-cover"
                    onClick={() => onSelect(gif.images.original.url, 'gif')}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
