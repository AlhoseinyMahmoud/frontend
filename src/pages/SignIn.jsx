import { useRef } from 'react';
import axios from 'axios';
import './signin.css';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

export default function SignIn() {
  const emailInput = useRef(null);
  const passwordInput = useRef(null);
  const rememberCheckInput = useRef(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Get input values
    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    try {
      // Make API call
      const response = await axios.get('http://localhost:1337/api/admins', {
        params: {
          filters: {
            Email: {
              $eq: email,
            },
          },
        },
      });

      // Check if user exists
      const user = response.data.data[0];
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'User not found',
          text: 'No user with this email address exists.',
        });
        return;
      }

      // Compare passwords
      const isPasswordCorrect = await bcrypt.compare(password, user.User_Password);
      if (isPasswordCorrect) {
        Swal.fire({
          title: 'Login Successful',
          text: `Welcome, ${user.First_name}!`,
          icon: 'success',
        });
        localStorage.setItem('user', JSON.stringify(user.documentId));

        // Optional: Save user data in local storage (if needed)
        // if (rememberCheckInput.current.checked) {
        //   localStorage.setItem('user', JSON.stringify(user));
        // }

        // Redirect to the dashboard or homepage
        window.location.href = '/';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Credentials',
          text: 'The email or password you entered is incorrect.',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred during login. Please try again later.',
      });
    }
  };

  return (
    <div className="d-flex justify-content-between flex-row">
      <div className="col-6 shapedividers_com-9141 rigth-log">
        <div className="col-6 mx-5 my-5">
          <a href="#top" className="flex items-center pt-5 fs-2 text-decoration-none col-12">
            <span className="ml-3 text-lg text-white">Rubick</span>
          </a>
        </div>
        <div className="d-flex flex-column justify-content-center col-10 align-items-center">
          <div className="mt-5">
            <img
              src="https://midone-svelte.vercel.app/_app/immutable/assets/illustration.fgVosos_.svg"
              alt=""
              width="85%"
            />
          </div>
          <div className="col-6">
            <div className="text-white fs-3">
              A few more clicks to sign in to your account.
            </div>
            <div className="text-white my-2">
              Manage all your e-commerce accounts in one place
            </div>
          </div>
        </div>
      </div>

      <div className="col-5 h-100 left-log d-flex m-auto">
        <form className="form" onSubmit={handleLogin}>
          <p className="form-title">Sign In </p>
          <div className="input-container">
            <input type="email" placeholder="Enter email" ref={emailInput} />
          </div>
          <div className="input-container">
            <input type="password" placeholder="Enter password" ref={passwordInput} />
          </div>
          <div className="flex-row mt-3 remrmber">
            <div>
              <input type="checkbox" ref={rememberCheckInput} />
              <label
                className="mx-2"
                style={{ color: rememberCheckInput.current?.checked ? 'blue' : 'inherit' }}
              >
                Remember me
              </label>
            </div>
            <span className={rememberCheckInput.current?.checked ? '' : 'text-muted'}>
              Forgot password?
            </span>
          </div>
          <button type="submit" className="submit my-4">
            Login
          </button>
          <p className="signup-link mt-5">
            No account? <a href="#">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
