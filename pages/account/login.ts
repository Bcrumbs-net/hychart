export async function getServerSideProps({ req }) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;

  const loginUrl = {
    pathname: process.env.LOGIN_URL,
    search: `?source=${protocol}://${host}`,
  };

  return {
    redirect: {
      destination: `${loginUrl.pathname}${loginUrl.search}`,
      permanent: false,
    },
  };
}

const LoginPage = () => {
  // This component will not be rendered due to the redirect
  return null;
};

export default LoginPage;
