type Props = {
  makeError: () => void;
};

const ErrorButton = (props: Props) => {
  return <button onClick={props?.makeError}>Error!</button>;
};

export default ErrorButton;
