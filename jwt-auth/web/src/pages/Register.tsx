import React, { useState } from "react";
import { useCreateAccountMutation } from "../generated/graphql";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  const [createAccount] = useCreateAccountMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(email, "and", password);

          const response = await createAccount({
            variables: {
              email,
              password,
            },
          });
          console.log(response.data?.createAccount);
        }}
      >
        <input
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
