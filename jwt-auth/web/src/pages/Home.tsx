import { useAllUsersQuery } from "../generated/graphql";

const Home = () => {
  const { data, loading, error } = useAllUsersQuery();
  return (
    <>
      <div>
        {loading ? (
          <div>loading....</div>
        ) : (
          data?.allUsers.map((item, i) => {
            return <li key={i}>{i + " " + item.email}</li>;
          })
        )}
      </div>
    </>
  );
};

export default Home;
