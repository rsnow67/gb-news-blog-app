import styles from './news.module.scss';

/* eslint-disable-next-line */
export interface NewsProps {}

export function News(props: NewsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to News!</h1>
    </div>
  );
}

export default News;
