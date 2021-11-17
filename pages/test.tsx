import type { NextPage } from "next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { z } from "zod";
import { useMutation } from "urql";
import { setToken } from "@/lib/utils";
import AlertBox from "@/components/alertBox";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i;

const schema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Invalid email",
    })
    .email({ message: "Please enter valid email" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Invalid password",
    })
    .min(8, { message: "Password too short" })
    .regex(passwordRegex, {
      message:
        "Password must contain one capital letter, one number & one special character",
    }),
  accountType: z.string({ required_error: "Account type is required" }),
});

const SignUpPage: NextPage = () => {
  const {
  register,
  watch,
  handleSubmit,
  formState: { errors, isValid },
} = useForm({
  mode: "all",
  resolver: zodResolver(schema),
});

const [page, setPage] = useState(0);

function goNextPage() {
  if (page === 2) return;

  if (page === 0 && watch("email") && !errors.email) {
    setPage((page) => page + 1);
  }

  if (page === 1 && watch("password") && !errors.password) {
    setPage((page) => page + 1);
  }
}

function goBack() {
  if (page === 0) return;
  setPage((page) => page - 1);
}

const [data, createUser] = useMutation(`
mutation ($name: String!, $password: String!, $accountType: String!) {
    createUser(name: $name, password: $password, accountType: $accountType)
}
`);

const onSubmit = (data: any) => {
  console.log(data);
  const { email, password, accountType } = data;
  createUser({ email, password, accountType }).then((result) => {
    console.log(result);
    setToken(result.data)
    // alert("Token to display from graphql server");
  });
};

return (
  <>
    <div className="container p-4 mx-auto w-full min-h-screen bg-gray-100">
      <div className="flex p-6 justify-center w-full md:w-1/2 mx-auto bg-white border rounded-lg shadow-lg">
        <form
          className="flex flex-col w-full md:w-1/2 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {page === 0 && (
            <>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                className="w-full py-2 px-3 rounded shadow appearance-none leading-tight focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                type="email"
                {...register("email")}
              />
              {errors.email && <AlertBox message={errors.email.message} />}
            </>
          )}
          {page === 1 && (
            <>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                className="w-full py-2 px-3 rounded shadow appearance-none leading-tight focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 focus:outline-none transition duration-300"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <AlertBox message={errors.password.message} />
              )}
            </>
          )}
          {page === 2 && (
            <>
              <label htmlFor="accountType">Account Type:</label>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <input
                    id="accountType"
                    className="my-auto"
                    type="radio"
                    {...register("accountType")}
                    value="Client"
                  />
                  <span>Client</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    id="accountType"
                    className="my-auto text-blue-100"
                    type="radio"
                    {...register("accountType")}
                    value="Therapist"
                  />
                  <span className="">Therapist</span>
                </div>
              </div>
              {errors.accountType && (
                <AlertBox message={errors.accountType.message} />
              )}
            </>
          )}
          <div className="flex mx-auto space-x-2">
            {page > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="py-1.5 px-2 border bg-gray-100 rounded-lg hover:bg-gray-300 hover:shadow-lg focus:ring-2 focus:ring-gray-700 transition duration-300"
              >
                Prev
              </button>
            )}
            {page < 2 && (
              <button
                onClick={goNextPage}
                className="py-1.5 px-2 border bg-gray-100 rounded-lg hover:bg-gray-300 hover:shadow-lg focus:ring-2 focus:ring-gray-700 transition duration-300"
              >
                Next
              </button>
            )}
            {page === 2 && (
              <button
                className="py-1.5 px-2 border text-white bg-blue-400 rounded-lg hover:bg-blue-600 hover:shadow-lg focus:ring-2 focus:ring-blue-200 transition duration-300"
                disabled={!isValid}
                type="submit"
              >
                Connect
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  </>
);
}

export default SignUpPage