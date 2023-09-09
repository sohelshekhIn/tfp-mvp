import AuthForm from "@/components/auth-form";

const Login = () => {
  return (
    <div className="p-5 flex flex-col justify-center h-screen">
      <div className="transform -translate-y-1/2 rounded-lg p-2">
        <h1 className="text-h2">Login</h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
