import React, { useState } from "react";
import { setAccessToken } from "../accessToken";
import { useLoginMutation } from "../generated/graphql";

interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
  const [loginMutation] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      Login
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log(email, "and", password);

          const response = await loginMutation({
            variables: {
              email,
              password,
            },
          });

          if (response.data) {
            setAccessToken(response.data.Login.accessToken);
          }
          console.log(response.data?.Login);
          // history.back();
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
