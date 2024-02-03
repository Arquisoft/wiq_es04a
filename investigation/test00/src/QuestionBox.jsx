import {AnswerBox} from "./AnswerBox"


export function QuestionBox() {

  const answers = ["Madrid","Gijón","Cataluña","París"];
  let question  = "What is the capital of Spain?"
  let correctAnswer = "Madrid";

  return (
    <section className="questionBox">
      <h1 className="question">{question}</h1>
      <div className="questions">
      {
      answers.map((element, index) => {
        let isCorrect = element === correctAnswer ? true : false;


        console.log(isCorrect)

        return ( 
          <AnswerBox isCorrect={isCorrect} key={element}>
           {index + 1 + ") " + element}
          </AnswerBox>
        )
      })
      }
      </div>
    </section>
  );
}

