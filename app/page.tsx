'use client'
import { useState, useEffect , useRef } from 'react';
import Navbar from "../components/shared/Navbar";
import { ChatInput } from "@/components/shared/ChatInput";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [selectedText, setSelectedText] = useState("");
  const [guestID, setGuestID] = useState("");
  const [token, setToken] = useState("");
  const [sessionID, setSessionID] = useState(""); // State to hold session ID
  const [convnId, setConversationId] = useState("");

  const authTokenRef = useRef<string | null>(null); // Ref to hold the authentication token


  // guestsignup and localstorage logic
  useEffect(() => {
    const storedGuestID = localStorage.getItem('UserID');
    const storedToken = localStorage.getItem('token');
    
    if (storedGuestID && storedToken) {
      setGuestID(storedGuestID);
      setToken(storedToken);
    } else {
      // Fetch API only if guestID and token are not stored in local storage
      fetchGuestAuthSignup();
    }
  }, []);

  const fetchGuestAuthSignup = async () => {
    try {
      const response = await fetch('https://govoyr.com/api/guest-auth/signup');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //.guest ---> .User
      //.guestId ---> UserId
      // setGuestID(data.guest.GuestId);
      // setToken(data.token);

      setGuestID(data.User.UserId);
      setToken(data.token);
      // Store guestID and token in local storage
      // localStorage.setItem('guestID', data.guest.GuestId);
      localStorage.setItem('UserID', data.User.UserId);
      
      localStorage.setItem('token', data.token);
      authTokenRef.current = data.token;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (newValue: string) => {
    setSelectedText(newValue);
  };

  // useEffect(() => {
  //   const storedConversationId = sessionStorage.getItem("conversationId");
  //   let isNewIdGenerated = false; // Flag to track if a new ID was generated

  //   // Check if stored conversation ID exists
  //   if (storedConversationId) {
  //     setConversationId(storedConversationId);
  //   } else {
  //     // If stored conversation ID doesn't exist, check if the page is refreshed
  //     if (
  //       window.performance.navigation.type === 1 ||
  //       window.performance.navigation.type == 0
  //     ) {
  //       const generateNewConversationId = async () => {
  //         try {
  //           const response = await fetch(
  //             "https://govoyr.com/api/WebChatbot/conversationId",
  //             {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${authTokenRef.current}`,
  //               },
  //               body: JSON.stringify({
  //                 platform: "web",
  //               }),
  //             }
  //           );
  //           if (response.ok) {
  //             const data = await response.json();
  //             const newConversationId = data.ConversationId;
  //             sessionStorage.setItem("conversationId", newConversationId);
  //             setConversationId(newConversationId);
  //             isNewIdGenerated = true; // Set the flag indicating a new ID was generated
  //           } else {
  //             console.error(
  //               "Failed to fetch conversation ID:",
  //               response.statusText
  //             );
  //           }
  //         } catch (error) {
  //           console.error("Error fetching conversation ID:", error);
  //         }
  //       };

  //       generateNewConversationId();
  //     }
  //   }

  //   // If a new ID was not generated, set the conversation ID using the stored value
  //   if (!isNewIdGenerated && storedConversationId) {
  //     setConversationId(storedConversationId);
  //   }
  // }, [authTokenRef]); // Include authTokenRef as a dependency if it's used inside the effect


// fetch authtoken from localstorage. 
// useEffect(() => {
//   //attempt1
//   const fetchAuthToken = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       authTokenRef.current = token;
//     } else {
//       console.log("token not found");
//     }
//   };
// fetchAuthToken();
// }, []);

//attempt2 
useEffect(() => {
  const fetchAuthToken = async () => {
    try {
      const authToken = localStorage.getItem('token');
      console.log("Retrieved token:", authToken);
      if (authToken) {
        authTokenRef.current = authToken;
      } else {
        console.log("Token not found in localStorage");
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  fetchAuthToken();
}, []);
 // useEffect(()=>{
  //   const params = new URLSearchParams(window.location.search);
  //     const urlConversationId = params.get("convid");
  //     if(urlConversationId&&urlConversationId.length>0){
  //       sessionStorage.setItem('conversationId',urlConversationId);
  //     }
  // },[])



//session id logic
//to get conversation ID 
// attempt 1 
useEffect(() => {
  const getSessionId = async () => {
    try {
      const response = await fetch('https://govoyr.com/api/WebChatbot/conversationId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokenRef.current}`,
        },
        body: JSON.stringify({
          platform: "web",
        })
      });
      if (response.ok) {
        const data = await response.json();
        const newConversationId = data.ConversationId;
        sessionStorage.setItem('conversationId', newConversationId); // Store conversation ID in local storage
        sessionStorage.removeItem('chatstarted');
        localStorage.setItem('conversationId', newConversationId); // Store conversation ID in local storage
        localStorage.removeItem('chatstarted');
        setConversationId(newConversationId);
      }else {
        console.error('Failed to fetch conversation ID:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching conversation ID:', error);
    }
  }

  getSessionId();
}, []);

console.log(token);

//attempt 1 
// useEffect(() => {
//   const getSessionId = async () => {
//     try {
//       const response = await fetch('https://govoyr.com/api/WebChatbot/conversationId', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           platform: "web",
//         })
//       });
//       if (response.ok) {
//         const data = await response.json();
//         const newConversationId = data.ConversationId;
//         sessionStorage.setItem('conversationId', newConversationId); // Store conversation ID in local storage
//       } else {
//         console.error('Failed to fetch conversation ID:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching conversation ID:', error);
//     }
//   };

//   getSessionId();
// }, []);


//attempt2
// useEffect(() => {
//   const getSessionId = async () => {
//     try {
//       // Retrieve token from local storage
//       // const authToken = localStorage.getItem('token');
//       // if (!authToken) {
//       //   console.error('Token not found in localStorage');
//       //   return;
//       // }

//       const authToken = localStorage.getItem('token');
// if (authToken) {
//   authTokenRef.current = authToken;
// } else {
//   console.log("Token not found in localStorage");
// }

//       // Make fetch request with the retrieved token
//       const response = await fetch('https://govoyr.com/api/WebChatbot/conversationId', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         },
//         body: JSON.stringify({
//           platform: "web",
//         })
//       });

//       console.log("Request Headers:", response.headers);

//       if (response.ok) {
//         const data = await response.json();
//         const newConversationId = data.ConversationId;
//         sessionStorage.setItem('conversationId', newConversationId);
//       } else {
//         console.error('Failed to fetch conversation ID:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching conversation ID:', error);
//     }
//   };

//   // Call getSessionId after the component mounts
//   getSessionId();
// }, []); // Empty dependency array to ensure it only runs once after component mount



const buttons = [
    "Bluetooth earbuds",
    "Phones with great camera",
    "Air purifier for office",
    "Massager for neck pain",
    "Gaming chair for home ",
    "Bicycle for city rides"
  ];

  const handleBadgeClick = (text: string) => {
    
    setSelectedText(text);
  };

  const userId = guestID;


  return (
    <>
      <main className="bg-[#111111]">
        <Navbar />
        <div className="flex flex-col w-[70%] items-center mt-28 h-screen mx-auto">
  <div className='w-full flex flex-col items-center mb-4 px-4 text-center '>
    <h1 className="font-semibold text-xl md:text-4xl sm:text-2xl lg:text-4xl text-white mb-2">Let's Shop Together</h1>
    {/* You can uncomment the line below if you want to add a preview */}
    {/* <span className='text-white'>preview</span> */}
  </div>

  <div className='w-[100%] flex justify-center mb-4'>
    <ChatInput initialText={selectedText} onInputChange={handleInputChange} searchQuery={userId} convnId={convnId} />
  </div>
<div className='w-[100%] md:max-w-2xl sm:max-w-2xl lg:max-w-2xl xl:max-w-2xl'>
  <div className="grid  grid-cols-2 xl:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 sm:grid-cols-3 w-[100%] gap-2">
    {buttons.map((text, index) => (
      <Badge
        key={index}
        className="text-[8px] md:text-[11px]  lg:text-[12px] xl:text-[14px] sm:text-[9px] hover:cursor-pointer bg-[#1A1A1A] text-[#999999] font-medium hover:bg-[#0C8CE9] hover:text-white py-1  transition ease-in-out shadow-sm"
        onClick={() => handleBadgeClick(text)}
      >
        {text}
      </Badge>
    ))}
  </div>
  </div>
</div>


      </main>
    </>
  );
}