import { useState, useRef, useEffect, useReducer } from 'react'
import Metatags from '../components/Metatags'
import styles from '../styles/Home.module.scss'
import { toast } from 'react-hot-toast'
import AnswerPanel from '../components/AnswerPanel'

type Reducer<S, A> = (prevState: S, action: A) => S;

type State = {
  score: number;
  rate: number;
  questionNumber: number;
  data?: Array<QuestionData>;
  error?: string;
}

type QuestionData = {
  type: QuestionType;
  genre: string; 
  question: string;
  answer: string;
  wrongAnswers?: string[];
}

type QuestionType = 
  | { type: 'Writing'}
  | { type: 'Multiple Choice'}
  | { type: 'Wheels'}

type Action = 
  | { type: 'Start Quiz'}
  | { type: 'Ask Question'}
  | { type: 'Correct Answer'}
  | { type: 'Wrong Answer'}
  | { type: 'Next Question'}
  | { type: 'End Quiz'};


function reducer(state: State, action: Action) : State {
  switch (action.type) {
    case 'Start Quiz':      
      return {  
        score: 0,
        rate: 0,
        questionNumber: 1,
        data: questions,
      };
    case 'Ask Question':
      return {  
        score: state.score,
        rate: state.rate,
        questionNumber: state.questionNumber,
        data: questions,
      };
    case 'Correct Answer':
      return {  
        score: state.score + 1,
        rate: 100 * (state.score + 1) / state.questionNumber,
        questionNumber: state.questionNumber,
        data: questions,
      };
    case 'Wrong Answer':
      return {  
        score: state.score,
        rate: 100 * (state.score / state.questionNumber),
        questionNumber: state.questionNumber,
        data: questions,
      };
    case 'Next Question':
      return {  
        score: state.score,
        rate: state.rate,
        questionNumber: state.questionNumber + 1,
        data: questions,
      };
    case 'End Quiz':
      return {  
        score: state.score,
        rate: state.rate,
        questionNumber: state.questionNumber,
        data: [],
      };
  }
}

const questions : Array<QuestionData> = Array({
  type: {type: 'Writing'},
  genre: '漢字の読み方',
  question: '日本武尊',
  answer: 'やまとたけるのみこと',
},
{
  type: {type: 'Writing'},
  genre: '漢字の読み方',
  question: '倭建命',
  answer: 'やまとたけるのみこと',
},
{
  type: {type: 'Writing'},
  genre: '漢字の読み方',
  question: 'ハム太郎',
  answer: 'はむたろう',
},
{
  type: {type: 'Multiple Choice'},
  genre: '正しい選択',
  question: '日本武尊',
  answer: 'やまとたけるのみこと',
  wrongAnswers: ['いぬやしゃ', 'そんごく', 'なると']
},
);

export default function Home() {
  // Timer Properties
  let ref = useRef<NodeJS.Timer | null>(null);
  const [timer, setTimer] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now() / 1000);
  const [answerDisabled, setAnswerDisabled] = useState(true);

  const [state, dispatch] = useReducer(reducer, {
      score: 0,
      rate: 0,
      questionNumber: -1,
      data: questions,
    }
  );

  function handleStartQuiz() {
    dispatch({type: 'Start Quiz'});
    dispatch({type: 'Ask Question'})
    setTimer(20);
    setAnswerDisabled(false);
  }

  function handleCheckAnswer() {
    if (!answerDisabled) {
      stopTimer();
      if (userAnswer === state.data?.at(state.questionNumber - 1)?.answer) {
        toast.success('Correct!', {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '50px',
              padding: '15px',
            },
          }
        );
        handleCorrectAnswer();
      } else {
        toast.error('Incorrect.', {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '50px',
              padding: '15px',
            },
          }
        );
        handleWrongAnswer();
      }
      handleNextQuestion();
    }
  }

  function handleCorrectAnswer() {
    dispatch({type: 'Correct Answer'})
  }

  function handleWrongAnswer() {
    dispatch({type: 'Wrong Answer'})
  }

  function handleNextQuestion() {
    if (state.questionNumber - 1 < questions.length - 1) {
      setTimer(20);
      setAnswerDisabled(false);
      dispatch({type: 'Next Question'})
    } else {
      // Results screen if questions are done
      handleEndQuiz();
    }
  }

  function handleEndQuiz() {
    setTimer(0);
    dispatch({type: 'End Quiz'})
  }

  const [userAnswer, setUserAnswer] = useState('');

  // Timer
  const getTime = () => {
    let now = Date.now() / 1000;
    let dt = now - lastUpdate;
    setTimer(timer - dt);
    setLastUpdate(now);
  }
  
  const stopTimer = () => {
    setTimer(0);
  }

  // Game Loop for Timer
  useEffect(() => {
    if (Number(timer) > 0) {
      const interval = setInterval(() => getTime(), 10);
      return () => clearInterval(interval);
    } else {
      handleCheckAnswer();
    }
  }, [timer]);

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (!answerDisabled) {
      setAnswerDisabled(true);
      handleCheckAnswer();
    }
  }

  const handleChange = (e:React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUserAnswer(e.currentTarget.value);
  }

  const handleButton = (e:React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleStartQuiz();
    console.log(state.data);
  }

  const handleMCAnswer = (e:React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.name + ' ' + state.data?.at(state.questionNumber - 1)?.answer);
    if (e.currentTarget.name === state.data?.at(state.questionNumber - 1)?.answer) {
      toast.success('Correct!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '50px',
          padding: '15px',
        },
      });
      handleCorrectAnswer();
    } else {
      toast.error('Incorrect.', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '50px',
            padding: '15px',
          },
        });
      handleWrongAnswer();
    }
    handleNextQuestion();
  }

  const handleNextQuiz = (e:React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }

  return (
    <>
      <Metatags title="Quiz Me Academically!" />
      <Navbar />
      <div className="container">
        <div className={styles.questionContainer}>
          <ul className={styles.questionDetails}>
            <li className={styles.questionCount}>第 {state.questionNumber} 問</li>
            <li className={styles.genre}>{state.data?.at(state.questionNumber - 1)?.genre}</li>
            <li className={styles.difficulty}>Correct: {state.rate.toFixed(0)}%</li>
          </ul>
          <p className={styles.question}>{state.data?.at(state.questionNumber - 1)?.question}</p>
        </div>
        <div className={styles.timerBorder}>
          <span className={styles.timer}>{timer.toFixed(2)}</span>
        </div>
        <div className={styles.answerContainer}>
          <form onSubmit={handleSubmit}>
          { (state.questionNumber == -1) ? 
            <button className={styles.button} onClick={handleButton}>Start Quiz</button> 
            : (state.data?.at(state.questionNumber - 1)?.type.type === 'Writing') ?
            <>
              <input
                onChange={handleChange}
                className={styles.answerInputBox}
                value={userAnswer}
              />
            </>
            : (state.data?.at(state.questionNumber - 1)?.type.type === 'Multiple Choice') ?
              <>
                <AnswerPanel
                  wrongAnswers={state.data?.at(state.questionNumber - 1)?.wrongAnswers}
                  answer={state.data?.at(state.questionNumber - 1)?.answer}
                  handleMCAnswer={handleMCAnswer}
                />
{/*             <button className={styles.button} onClick={handleButton}>{state.data?.at(state.questionNumber - 1)?.wrongAnswers?.at(0)}</button>
                <button className={styles.button} onClick={handleButton}>{state.data?.at(state.questionNumber - 1)?.wrongAnswers?.at(1)}</button>
                <button className={styles.button} onClick={handleButton}>{state.data?.at(state.questionNumber - 1)?.wrongAnswers?.at(2)}</button> */}
              </>
            : <>
              <div className={styles.resultsContainer}>
                <h2>Results: {state.score} / {state.questionNumber}</h2>
                <h2>Rate: {state.rate} %</h2>
              </div>
              <button className={styles.button} onClick={handleNextQuiz}>Next Quiz</button>
            </>
            }
          </form>
        </div>
      </div>
    </>
  );
}

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </nav>
  );
}