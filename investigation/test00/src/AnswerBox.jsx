
export function AnswerBox(children, isCorrect) {

    const isTheQCorrect = isCorrect;


    // const clickHandler = () => {
    //     return isCorrect;
    // };

    return (
        <div onClick="clickHandler" className="answerBox">
            {children.children}
        </div>
    );
  }
  
  