import Metatags from '../../components/Metatags';
import styles from '../../styles/Quiz.module.scss'

export default function QuizPage() {
  return(
    <main>
      <Metatags title="Quiz Me Academically!" />
      
      <div className="container">

        <h1 className={styles.title}>Quiz</h1>
        
      </div>
    </main>
  );
}