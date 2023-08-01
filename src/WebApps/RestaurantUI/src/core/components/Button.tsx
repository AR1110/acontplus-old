type Props = {
  className: string;
  onClick: (event: MouseEvent) => void;
  text: string;
};

 function Button({ className, onClick, text }: Props) {
  return (
    <>
      <button type="button" className={className} onClick={() => onClick}>
        {text}
      </button>
    </>
  );
}

export {
  Button
}
