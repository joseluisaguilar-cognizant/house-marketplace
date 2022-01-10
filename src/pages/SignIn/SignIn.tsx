import { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from 'react-toastify';

import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';

interface IFormData {
  email: string;
  password: string;
}

const SignIn: FunctionComponent = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    setFormData((prevValue: IFormData) => ({ ...prevValue, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad user credentials');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            className="emailInput"
            placeholder="email"
            value={email}
            onChange={handleInputChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPass ? 'text' : 'password'}
              className="passwordInput"
              placeholder="Password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <img
              src={visibilityIcon}
              alt="show password"
              className="showPassword"
              onClick={() => setShowPass((prevValue: boolean) => !prevValue)}
            />
          </div>
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>
          <div className="signInBar">
            <p className="signInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Google OAuth */}
        <Link to="/sign-up" className="registerLink">
          Sign Up Instead
        </Link>
      </div>
    </>
  );
};

export default SignIn;
