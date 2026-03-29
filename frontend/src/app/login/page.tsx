import { Suspense } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "ログイン — メシとも",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-50 px-4">
            <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          </main>
        }
      >
        <LoginForm />
      </Suspense>
    </>
  );
}
