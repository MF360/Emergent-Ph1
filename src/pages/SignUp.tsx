import AuthForm from "../components/AuthForm";
import { signUp } from "../lib/auth/actions";

export default function SignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <AuthForm mode="sign-up" onSubmit={signUp} />
      </div>
    </div>
  );
}
