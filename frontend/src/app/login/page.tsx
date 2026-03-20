import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "ログイン — メシとも",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <LoginForm />
    </>
  );
}
