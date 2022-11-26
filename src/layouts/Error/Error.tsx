import React, { Component, ErrorInfo, ReactNode } from 'react';
import image500 from 'assets/images/500.png';
import styles from './error.module.scss';

type ErrorProps = {
  children: ReactNode;
};

type ErrorState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorProps, ErrorState> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): ErrorState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.wrapper}>
          <img src={image500} alt="broken robot" className={styles.img} />
          <h1 className={styles.title}>Woops! Something went wrong</h1>
          <p className={styles.text}>Brace yourself till we get the error fixed.</p>
          <p className={styles.text}>You may also refresh the page or try again later</p>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
