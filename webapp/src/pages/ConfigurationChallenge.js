import * as React from 'react';
import axios from 'axios';

import { Container, Button, Select, FormControl, InputLabel, MenuItem, Box, Divider, Snackbar, Typography } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const Configuration = ({ onSubmit }) =>{
    const [timePerQuestion, setTimePerQuestion] = React.useState(15); // Time to answer each question in seconds
    const [category, setCategory] = React.useState(null); // Category of questions
    const [rounds, setRounds] = React.useState(3); // Number of rounds
    const [positivePoints, setPositivePoints] = React.useState(100); // Points earned when guessing a question
    const [negativePoints, setNegativePoints] = React.useState(10); //Points lost when failing a question
  
    const handleSubmit = (e) => {
      e.preventDefault();
      saveConfiguration();
      // Envía la configuración al padre
      onSubmit({ timePerQuestion, category, rounds, positivePoints, negativePoints });
    };

    const saveConfiguration = async () => {
        try {
          const response = await axios.post(`${apiEndpoint}/challengegame/configuration`, {
            timePerQuestion: timePerQuestion,
            category: category,
            rounds: rounds
          });
          const data = await response.json();
          setTimePerQuestion(data.timePerQuestion);
          setCategory(data.category);
          console.log('Configuración guardada:', data);
          // Procesar la configuración devuelta si es necesario
        } catch (error) {
          console.error('Error al guardar la configuración:', error);
        }

      };

    const handleTimePerQuestionChange = (event) => {
        setTimePerQuestion(event.target.value);
    };
    
    const handleRoundsChange = (event) => {
        setRounds(event.target.value);
    };
    
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };
    
    const categories = ['All', 'Geography', 'Sports'];


    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex:'1', marginTop: '2em', marginBottom: '2em'}}>
          <Box sx={{margin: '2em'}}>
            <div>
              <Typography component="h1" variant="h5">
                Configuration
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="time-per-question-label">Time per question</InputLabel>
                <Select
                  labelId="time-per-question-label"
                  id="time-per-question"
                  value={timePerQuestion}
                  onChange={handleTimePerQuestionChange}
                >
                  <MenuItem value={1}>5</MenuItem>
                  <MenuItem value={2}>10</MenuItem>
                  <MenuItem value={3}>15</MenuItem>
                  <MenuItem value={4}>20</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="number-of-questions-label">Number of questions</InputLabel>
                <Select
                  labelId="number-of-questions-label"
                  id="number-of-questions"
                  value={rounds}
                  onChange={handleRoundsChange}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Divider style={{ marginTop:'3%'}}/>
              <Button variant="contained" color="primary" style={{ width: '100%', marginTop: '5%' }}
                onClick={handleSubmit}>
                Save Configuration
              </Button>
              <Snackbar open={false} autoHideDuration={6000} message="Configuration saved" />
            </div>
          </Box>
        </Container>
      );
};

export default Configuration;
