import React, {useEffect, useState} from 'react';
import {getArticles} from '../data';
import './ArticlesList.css';
import {MdOpenInNew} from 'react-icons/md';

export default () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <div className="articles-list">
      {articles.map(article => (
        <article className="articles-list__article" key={article.id}>
          <a
            className="articles-list__article__title-link"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.title}
          </a>

       <div className="articles-list__article__icons">
          <a
            href={article.url}
            target="_blank"
            className="articles-list__article__open-icon-link"
            rel="noopener noreferrer"
          >
            <MdOpenInNew/>
          </a>
        </div>

        </article>
      ))}

    </div>
  );
}
