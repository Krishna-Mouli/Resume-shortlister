import { Box, TextareaAutosize, Typography } from "@mui/material";
import { FaUser } from "react-icons/fa";
import brain from '../assets/images/brain.svg';

export const MessageContainer = ({isBot, message})=>{
    console.log("This is the message\n", message)
    return(
        <Box style={{display:'flex', flexDirection:'column', marginBottom:`${isBot ? "80px" : "20px"}`}}>
            <Box style={{display:'flex', }}> 
                <Box style={{marginRight:'10px'}}>
                    {
                        isBot ? 
                        <img src={brain} alt="Profile" style={{ width: 30, height: 30, borderRadius: '50%' }} />
                        :
                        <FaUser style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    }   
                    
                </Box>
                <Box>
                    <Typography fontWeight={"bold"} fontSize={'20px'} fontFamily={'monospace, Courier New, Courier'}>
                        { isBot ?
                            "AI"
                            :
                            "HR"
                        }
                    </Typography>
                </Box>
            </Box>
            <Box style={{paddingLeft:'40px'}}>
                {
                    isBot ?
                    <TextareaAutosize 
                        readOnly
                        style={{
                            background:'#191818',
                            color:'white',
                            width:'100%',
                            resize:'none',
                            border:'none',
                            outline: 'none',
                            fontSize:'16px',
                            fontFamily:'Courier',
                        }}
                    >
                        {message}
                    </TextareaAutosize>
                    :
                    <TextareaAutosize 
                        readOnly
                        style={{
                            background:'#191818',
                            color:'white',
                            width:'100%',
                            resize:'none',
                            border:'none',
                            outline: 'none',
                            fontSize:'16px',                            
                        }}
                    >
                        {message}
                    </TextareaAutosize>
                }
                
            </Box>
        </Box>
    )
}