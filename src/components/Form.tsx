import React, {useState} from 'react';

interface FormProps {
  title: string,
  handleClick: (email: string, pass: string) => void,
}

const Form: React.FC<FormProps> = ({title, handleClick}) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

  const handlePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPass(e.target.value);
  }

  const handleButton = () => {
    handleClick(email, pass);
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleEmail}
        placeholder="email"
      />
      <input
        type="password"
        value={pass}
        onChange={handlePass}
        placeholder="password"
      />
      <button onClick={handleButton}>
        {title}
      </button>
    </div>
  );
};

export default Form;
