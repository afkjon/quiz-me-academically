import { useState } from 'react';
import styles from '../styles/Home.module.scss';

interface AnswerPanelProp {
  wrongAnswers: string[] | undefined;
  answer: string | undefined;
  handleMCAnswer: (e: React.FormEvent<HTMLButtonElement>) => void;
}

function shuffle(array:string[] | undefined) {
  let length = array?.length;
  let exclusions = new Array<number>();
  let result = [];

  if (length){
    while (result.length < length) {
      const r = Math.floor(Math.random() * length);

      if (!exclusions.includes(r)) {
        result.push(array?.at(r));
        exclusions.push(r);
      }
    };
  }
  return result;
}


export default function AnswerPanel ({wrongAnswers, answer, handleMCAnswer} : AnswerPanelProp) {
  const [answers, setAnswers] = useState(shuffle(wrongAnswers?.concat([answer??''])));
  
  return (
  <>
    <button className={styles.button} name={answers[0]} onClick={handleMCAnswer}>{answers[0]}</button>
    <button className={styles.button} name={answers[1]} onClick={handleMCAnswer}>{answers[1]}</button>
    <button className={styles.button} name={answers[2]} onClick={handleMCAnswer}>{answers[2]}</button>
    <button className={styles.button} name={answers[3]} onClick={handleMCAnswer}>{answers[3]}</button>
  </>
  )
}

declare namespace JSX {
  interface IntrinsicAttributes {
    AnswerPanel : { answers: string[]}; // specify the property name to use
  }
}