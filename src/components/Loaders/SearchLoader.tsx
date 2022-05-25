import React from 'react';
import styles from 'components/Loaders/style.module.css'
import cn from "classnames";

const SearchLoader: React.FC<{avatarURL: string}> = ({avatarURL}) => {
  return (
    <article className={cn(styles.tdating, styles.tdating__pulse)}>
      <img
        src={avatarURL}
        alt="User avatar"
        className={cn(styles.profile_img, "rounded-full")}
      />
    </article>
  );
};

export default React.memo(SearchLoader);
