import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/AxiosConfig";
import { toast } from "react-toastify";

const Login = () => {

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const userLoggedIn = () => toast("User Logged In Successfully", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  const loginUser = (user) => {
    reset();
    axios.post("/auth/login", user,{
      withCredentials: true,
    })
    .then((res)=>{
      console.log(res);
      userLoggedIn();
      navigate("/");
    })
    .catch((err)=>{
      console.log(err);
    })
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col md:flex-row">
      <div className="w-full flex-1 md:w-1/2 flex flex-col items-center justify-center bg-gray-900 p-8 md:p-12">
        <div className="w-full max-w-md flex flex-col gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-gray-400 text-lg">Enter your details below to login</p>
          </div>

          <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-6">
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
              Sign In
            </button>

            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login