"use client";

import SignUpForm from "@/components/SignUpForm";
import { Suspense } from "react";

const SignUp = () => (
  <Suspense>
    <SignUpForm />
  </Suspense>
);

export default SignUp;
