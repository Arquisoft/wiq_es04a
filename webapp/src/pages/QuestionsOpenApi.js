import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';


const QuestionsOpenApi = () => {
    return <SwaggerUI url="../../../questions/questions-openapi.yaml" />;
};
  
export default QuestionsOpenApi;
  