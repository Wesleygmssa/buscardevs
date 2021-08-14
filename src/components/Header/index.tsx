// import { SignInButton } from "../SigninButton";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="https://nerdin.com.br/img/empresa/1363.png" alt="" />

        {/* <SignInButton /> */}
      </div>
    </header>
  );
}
