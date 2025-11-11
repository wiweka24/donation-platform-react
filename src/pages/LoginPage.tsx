import { use, useEffect } from "react";
import { useLoginMutation } from "../services/apiService";

export default function LoginPage() {
  const [login, result] = useLoginMutation();

  useEffect(() => {
    login({
      email: "test@example.com",
      password: "apassword123",
    });
  }, []);

  useEffect(() => {
    if (result.isSuccess) {
      console.log(result);
    }
  }, [result]);

  return (
    <div className="h-screen w-screen items-center flex flex-col justify-center">
      LoginPage
    </div>
  );
}
