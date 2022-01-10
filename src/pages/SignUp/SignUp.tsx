import { ChangeEvent, FormEvent, FunctionComponent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { setDoc, doc, serverTimestamp, FieldValue } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../../firebase.config';

import { ReactComponent as ArrowRightIcon } from '../../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../../assets/svg/visibilityIcon.svg';

interface IFormData {
  name: string;
  email: string;
  password: string;
  timestamp?: FieldValue;
}

const SignUp: FunctionComponent = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

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
      // ! "db" must be called to launch "initializeApp" from firebaseConfig

      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser as User, { displayName: name });

      // Add user to the DB
      const formDataCopy = { ...formData };
      formDataCopy.password = '-';
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome!</p>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            className="nameInput"
            placeholder="name"
            value={name}
            onChange={handleInputChange}
          />
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
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#fff" width="34px" height="34px" />
            </button>
          </div>
        </form>

        {/* Google OAuth */}
        <Link to="/sign-in" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
};

export default SignUp;
