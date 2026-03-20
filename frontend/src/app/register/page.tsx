import Header from "@/components/Header";
import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "新規登録 — メシとも",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <RegisterForm />
    </>
  );
}
