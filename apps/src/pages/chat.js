import { Box, Skeleton, Stack, TextareaAutosize, Typography } from "@mui/material"
import { LuSendHorizonal } from 'react-icons/lu';
import { MessageContainer } from "../components/messagecontainer";
import { useEffect, useRef, useState } from "react";
import { InitialScreen } from "../components/InitialScreen/InitialScreen";
import useApiClient from "../core/apiclient";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from "../store/slice/messagesslice";
import { BiReset } from "react-icons/bi";

const Chat = () => {
  const [messageTextarea, setMessageTextarea] = useState('');
  const [showSkeletonLoader, setSkeletonLoader] = useState(false);
  const userQuestionRef = useRef(null);
  const apiClient = useApiClient();
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.messages);

  useEffect(() => {
    console.log('messages useeffect', messages)
    userQuestionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  const handleresetchat = async () => {
    dispatch(setMessages([]));    
    const resp = await apiClient.post('/resume/sourceid/123456/resumeid/f8b7c3a1-9d2e-4f5b-8c7a-6d4e3f2b1a9c/conversationid/567890/resetchat');
    if(resp.data.content === true)
    {
      alert("Chat refresh successful")
    }
    else
    {
      alert("Chat refresh failed")
    }
  } 

  const handleSendClick = async () => {
    let userMessage = {
      role: 'user',
      content: messageTextarea
    };
    let newMessagesArray = [...messages, userMessage];
    dispatch(setMessages(newMessagesArray))
    setSkeletonLoader(true);
    const apiResponse = await chatCall();
    console.log('apiresp', apiResponse)
    const botResponse = apiResponse[apiResponse.length - 1];
    console.log('botResponse', botResponse)
    dispatch(setMessages([...newMessagesArray, apiResponse]));
    console.log('API call completed', apiResponse);
    setMessageTextarea('');
    setSkeletonLoader(false);
  };

  const chatCall = async () => {
    const payload = {
      "searchrequest": messageTextarea,
    }
    const response = await apiClient.post('/resume/sourceid/123456/resumeid/f8b7c3a1-9d2e-4f5b-8c7a-6d4e3f2b1a9c/conversationid/567890/converse', payload);
    return response.data
  }


  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '90vh', width: '100%', color: 'white', backgroundColor: '#191818' }}>
      <Box style={{ height: '85%', paddingInline: '20%', paddingTop: '50px', overflow: 'auto', color: 'white', backgroundColor: '#191818' }}>
        {
          messages.length <= 0
            ?
            <Box style={{ height: '100%' }}>
              <InitialScreen />
            </Box>
            :
            messages.map((item, index) => {
              const isBot = item.role === "user" ? false : true;
              const itemProps = item.role === 'user' ? { ref: userQuestionRef } : {};
              return <Box {...itemProps}><MessageContainer isBot={isBot} message={item.content} /></Box>
            })
        }
        {
          showSkeletonLoader &&
          <Stack spacing={0} style={{ height: '400px' }}>
            <Skeleton
              variant="text"
              sx={{
                fontSize: '1.5rem',
                background: 'linear-gradient(to right, #444, #888)',
                borderRadius: '5px',
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                fontSize: '1.5rem',
                background: 'linear-gradient(to right, #222, #666)',
                borderRadius: '5px',
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                fontSize: '1.5rem',
                background: 'linear-gradient(to right, #333, #777)',
                borderRadius: '5px',
              }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{
                fontSize: '1.5rem',
                width: '80%',
                background: 'linear-gradient(to right, #444, #999)',
                borderRadius: '5px',
              }}
            />
          </Stack>
        }
      </Box>
      <Box style={{ height: "15%", paddingInline: "20%" }}>
                <Box display="flex" justifyContent="center">
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "monospace, Courier New, Courier",
                        }}
                    >
                        Software Company
                    </Typography>
                </Box>
                <Box
                    className="userInputTextarea"
                    style={{
                        width: "100%",
                        backgroundColor: "black",
                        borderRadius: "20px",
                        paddingInline: "10px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "10px",
                    }}
                >   
                    <Box>
                      <BiReset 
                        size="1.5em"
                        color="#e8e6e3"
                        onClick={handleresetchat}/>
                    </Box>                 
                    <TextareaAutosize
                        value={messageTextarea}
                        onChange={(event) => setMessageTextarea(event.target.value)}
                        placeholder="Send Message"
                        className="completeQuestion-textarea"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSendClick();
                          }
                        }}                        
                        style={{
                            resize: "none",
                            width: "100%",
                            border: "none",
                            minHeight: "16px",
                            maxHeight: "50px",
                            backgroundColor: "black",
                            outline: "none",
                            paddingLeft: "10px",
                            borderRadius: "10px ",
                            color: "#e8e6e3",
                        }}
                    ></TextareaAutosize>
                    <Box>
                        <LuSendHorizonal
                            size="1.5em"
                            color="#e8e6e3  "
                            style={{ cursor: "pointer" }}
                            onClick={handleSendClick}
                        />
                    </Box>
                </Box>
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                    }}
                >
                    <Typography style={{ fontSize: "10px", color: "#e8e6e3" }}>
                        AI may provide incorrect info, please verify important details.
                    </Typography>
                </Box>
            </Box>
    </Box>
  )
}

export default Chat;