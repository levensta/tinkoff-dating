import React, {useState} from 'react';

interface FormProps {
  title: string,
  handleClick: (email: string, pass: string) => void,
}

const AuthForm: React.FC<FormProps> = ({title, handleClick}) => {
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
    <div className={"flex flex-col py-3"}>
      <input
        type="email"
        value={email}
        onChange={handleEmail}
        placeholder="Email"
        className={"p-3 my-3 outline-none rounded-sm bg-slate-100 hover:bg-slate-200 focus:bg-white focus:outline-1 focus:outline-stone-900 transition-all"}
      />
      <input
        type="password"
        value={pass}
        onChange={handlePass}
        placeholder="Пароль"
        className={"p-3 my-3 outline-none rounded-sm bg-slate-100 hover:bg-slate-200 focus:bg-white focus:outline-1 focus:outline-stone-900 transition-all"}
      />
      <button
        onClick={handleButton}
        className={"p-3 my-3 rounded-sm bg-yellow-400 hover:bg-amber-400 focus:bg-yellow-500 transition-all"}
      >
        {title}
      </button>
    </div>
  );
};

export default AuthForm;
