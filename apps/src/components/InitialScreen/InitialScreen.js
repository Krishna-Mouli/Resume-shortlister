import { Box, Typography } from '@mui/material';
import { InitialScreenCard } from './InitialScreenCard';

export const InitialScreen = ()=>{
    let cards = [];
    for(let i=0; i <= 3; i++){
        cards.push(<InitialScreenCard index={i}/>)
    }

    return(
        <Box style={{display:'flex', alignItems:'center', width:'100%', flexDirection:'column', justifyContent:'center', height:'100%'}}>
            <Box style={{marginBottom:'15px'}}>
                <Typography 
                variant='h2' 
                fontWeight={'bold'}
                style={{
                    background: 'linear-gradient(to right, darkcyan, cyan)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    fontFamily:'monospace, Courier New, Courier'
                }}
                >
                    Chat with Resume
                </Typography>
            </Box>
            {/* <Box className='spinner-logo'>
                <img width={150} src={} className='spinner-img' alt='spinner' style={{ borderRadius: '50%' }} />
            </Box> */}
            <Box style={{display:'flex', marginTop:'30px', gap:'10px'}}>
                {
                    cards
                }
            </Box>                       
        </Box>
    )
}