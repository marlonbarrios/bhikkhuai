import './normal.css';
import './App.css';
import { useState, useEffect } from 'react';
import SideMenu from './SideMenu'
import ChatBox from './ChatBox'

function App() {

  useEffect(() => {
    getEngines();
  }, [])

  const [chatInput, setChatInput] = useState("");
  const [models, setModels] = useState([]);
  const [temperature, setTemperature] = useState(0.5);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: " I'm BhikkhuAI, and I'm honored to serve as your AI Vipassana meditation guide. The teachings and instructions I offer are rooted in the Theravada Tradition of early Buddhism, which I received freely from my teachers through the practice of dana or generosity. In the spirit of Dhamma and the tradition of dana, I offer these teachings to you with the intention of helping you cultivate mindfulness and develop greater peace and insight in your life. Although Buddhism has numerous traditions, my training has been exclusively in the Theravada tradition. What can I assist you with today??"
  }]);

  // clear chats
  function clearChat(){
    setChatLog([]);
  }

  function getEngines(){
    fetch("http://localhost:3080/models")
    .then(res => res.json())
    .then(data => {
      console.log(data.models.data)
      // set models in order alpahbetically
      data.models.data.sort((a, b) => {
        if(a.id < b.id) { return -1; }
        if(a.id > b.id) { return 1; }
        return 0;
      })
      setModels(data.models.data)
    })
  }
  
  async function handleSubmit(e){
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${chatInput}`} ]
    setChatInput("");
    setChatLog(chatLogNew)
    // fetch response to the api combining the chat log array of messages and seinding it as a message to localhost:3000 as a post
    const messages = chatLogNew.map((message) => message.message).join("\n")
    
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
       })
      });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`} ])
    var scrollToTheBottomChatLog = document.getElementsByClassName("chat-log")[0];
    scrollToTheBottomChatLog.scrollTop = scrollToTheBottomChatLog.scrollHeight;
  }

  function handleTemp(temp) {
    if(temp > 1){
      setTemperature(1)
    } else if (temp < 0){
      setTemperature(0)
    } else {
      setTemperature(temp)
    }

  }

  return (
    <div className="App">
      <SideMenu
        currentModel={currentModel} 
        setCurrentModel={setCurrentModel} 
        models={models}
        setTemperature={handleTemp}
        temperature={temperature}
        clearChat={clearChat}
      />
      <ChatBox 
        chatInput={chatInput}
        chatLog={chatLog} 
        setChatInput={setChatInput} 
        handleSubmit={handleSubmit} />
    </div>
  );
}


export default App;
