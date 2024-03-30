import * as React from 'react';
import { useState, useEffect } from 'react';
import {Typography, Box, Card, CardActionArea, CardContent } from '@mui/material';


import OpenAI from 'openai';



const Photo = (props) => {
  const [valor, setValor] = useState(props.questionData.correctAnswer);
  const [resultados, setResultados] = useState([]);
  const [info, setInfo] = useState();
  const [question, setQuestion] = useState(props.questionData.question);


  useEffect(() => {
    // Actualiza el valor cuando props.questionData cambia
    setValor(props.questionData.correctAnswer);
    setQuestion(props.questionData.correctAnswer)
  }, [props.questionData]);

  const chatGPT = async () => {
    const openai = new OpenAI({apiKey:'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', dangerouslyAllowBrowser:true});
    const completion = await openai.chat.completions.create({
      prompt: {question} ,
      model: "gpt-3.5-turbo",
    });

    setInfo(completion.choices[0]);
  }

  const buscarResultados = async () => {

    const ACCESS_KEY = 'tMukKPzKPjLvDq3gyWEojI38X7zJQZsPeD6DBtaxSJ0'
    const URL = `https://api.unsplash.com/search/photos/?query=${valor}&client_id=${ACCESS_KEY}`;

    const response = await fetch(URL);
    const data = await response.json();

    setResultados(data.results);
  }

  buscarResultados();
    chatGPT();

  return (
    <div>
      {resultados.length < 1 && <Typography variant="h5" align="center">{question}{valor}</Typography>}
      {resultados.length > 0 &&
        <Card sx={{ height:'100%', }}>
          <CardActionArea sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height:'100%'}}>
            <Box sx={{width:'50%'}}>
              <img style={{width: '100%', height:'100%', maxHeight: '40vh'}}  key='foto' src={resultados[0].urls.regular} alt='Foto sobre el dato correcto' />
            </Box>
            <CardContent sx={{width:'50%'}}>
              <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}> {question} </Typography>
              <Typography variant="body2" color="text.secondary"> {info}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      }
    </div>
  );
}

export default Photo;