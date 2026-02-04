const ErrorMessage = ({ message }: { message: string }) => {
  return <p className='text-accent text-sm py-10 text-center'>{message}</p>;
};

export default ErrorMessage;
