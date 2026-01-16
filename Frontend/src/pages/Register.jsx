import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../api/AxiosConfig";
import { toast } from "react-toastify";

const Register = () => {

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const userRegistered = () => toast("User Registered Successfully", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const registerUser = (user) => {
    console.log(user);
    reset();
    axios.post("/auth/register", {
      email: user.email,
      fullName: {
        firstName: user.firstName,
        lastName: user.lastName
      },
      password: user.password
    },
    {
      withCredentials: true
    })
    .then((res) => {
      console.log(res);
      userRegistered();
      navigate("/login");
    })
    .catch((err) => {
      console.log(err);
    })
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col md:flex-row">
      <div className="w-full flex-1 md:w-1/2 flex flex-col items-center justify-center bg-gray-900 p-8 md:p-12">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">New Here?</h1>
            <p className="text-gray-400 text-lg">Enter your details below to register</p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(registerUser)}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">First Name</label>
              <input
                {...register("firstName")}
                className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-750"
                type="text"
                placeholder="Enter your first name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Last Name</label>
              <input
                {...register("lastName")}
                className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-750"
                type="text"
                placeholder="Enter your last name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <input
                {...register("email")}
                className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-750"
                type="text"
                placeholder="name@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <input
                {...register("password")}
                className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-750"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <button className="w-full py-3.5 mt-2 cursor-pointer bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95 active:shadow-none">
              Register
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register