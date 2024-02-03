
import {useState} from "react"


export function AnswerBox(props) {
    const [isAnswered, setAnswered] = useState(false);
    const {children, isCorrect} = props;
    console.log(isCorrect)
    const handleClick = () => {
        setAnswered(true);
    };

    let answerBoxClassName = "answerBox";
   
    if(isAnswered){
        if(isCorrect == true){
            answerBoxClassName = "answerBox-correct";
        }else{
            answerBoxClassName = "answerBox-incorrect";
        }
    }

    return (
        <div onClick={handleClick} className={answerBoxClassName}>
            {children}
        </div>
    );
  }
  
  