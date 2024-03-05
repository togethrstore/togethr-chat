'use client'
import { useState, useEffect } from 'react';
import Navbar from "@/components/shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IoIosArrowForward } from "react-icons/io";
import Loader from "@/components/shared/Loader";

interface Params {
  slug: string[];
}

interface Message {
  sender: string;
  content: string;
}

export default function Page({ params }: { params: Params }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { slug } = params;
  const userId = slug[0];
  const searchQuery = slug[1];

  useEffect(() => {
    if (searchQuery) {
      setUserMessage(decodeURIComponent(searchQuery)); // Decode the query and set it in the input field
    }
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleInputChange = (newValue: string) => {
    setUserMessage(newValue);
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const newMessage: Message = { sender: 'user', content: message };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setUserMessage("");

    try {
      const response = await fetch('http://43.205.216.141/api/WebChatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          userMessage: message,
          id: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.AI_Response;
        const newAiMessage: Message = { sender: 'AI', content: aiResponse };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadmsg = "Togethr assistant at work..."
  return (
    <main className="bg-[#F4F7FE]">
      <Navbar />

      <section className="flex justify-center h-full mb-16 bp-0 ">
        <div className="md:max-w-2xl max-w-sm mt-5 mb-10 h-full p-0 ">
          {/* {isLoading && <Loader />} */}
          {messages.map((message, index) => (
              // {isLoading && loadmsg }
            <div key={index} className={`flex flex-row gap-4 mx-1 md:mx-6 my-5 ${message.sender === 'AI' ? 'justify-start' : 'justify-end'}`}>
              {message.sender === 'AI' ? (
                <>
                  <Avatar className="shadow-md z-10">
                    <AvatarImage src="/ai.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex w-max max-w-[75%] font-medium flex-col gap-2 text-[#94A3B8] rounded-xl shadow-lg px-3 py-2 text-xs md:text-sm bg-[#FFFFFF]">
                    { message.content}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-max max-w-[75%] flex-col font-medium gap-2 rounded-xl shadow-lg px-3 py-2 text-xs md:text-sm ml-auto bg-[#2D29F8] text-primary-foreground">
                    {message.content}
                  </div>
                  <Avatar className="shadow-lg">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="fixed bottom-0 w-full flex justify-center mt-5  p-5 bg-[#F4F7FE]">
        <div className="flex w-full max-w-2xl h-[58px] items-center space-x-2">
          <Input
            type="email"
            placeholder="Find your product"
            className="transition border-pink-500 focus:border-pink-600 shadow-lg shadow-pink-200 rounded-xl h-full"
            value={userMessage}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        <Button
  type="submit"
  className="bg-[#FF58A8] hover:bg-pink-600 font-bold rounded-xl focus:border-pink-600 h-[58px]  w-[58px] md:w-[65px]"
  onClick={() => sendMessage(userMessage)} // Pass userMessage to sendMessage function
>
  <IoIosArrowForward className='h-2/3'/>
</Button>

        </div>
      </footer>
    </main>
  );
}
