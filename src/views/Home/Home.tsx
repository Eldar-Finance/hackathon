import { useSession, signIn, signOut } from "next-auth/react"
import { Button, Box } from "@chakra-ui/react";
import { useGetUserInfo } from "@/views/Home/hooks/hooks";
import NewUserForm from "./components/NewUserForm/NewUserForm";
import withDappProvider from "@/hoc/withDappProvider";
import ExistingUser from "./components/ExistingUser/ExistingUser";


const Home = () => {

  const { data: session } = useSession()
  console.log("⚠️ ~ file: Home.tsx:12 ~ Home ~ session::::", session)

  const email = session?.user?.email || "";
  const platform = "google";

  const {userInfo, isLoadingUserInfo, errorUserInfo} = useGetUserInfo(email, platform);

  let userExists = false;
  if (!isLoadingUserInfo && session && userInfo?.username != "" && userInfo?.address != null) {
    userExists = true;
  }

  if (session) {
    return (
      <Box>
        Signed in as {session?.user?.email} <br />
        ID: {session?.user?.sub} <br />
        <Button
          w={'fit'}
          _hover={{
            opacity: 1,
            boxShadow: 'lg'
          }}
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
        {userExists ?
          <ExistingUser username={userInfo?.username || ""} address={userInfo?.address || ""} secretWords={userInfo?.secretWords || []}/>
          :
          <NewUserForm email={email} platform={platform}/>
        }
      </Box>
    )
  }
  return (
    <Box>
      Not signed in <br />
      <Button
        w={'fit'}
        _hover={{
          opacity: 1,
          boxShadow: 'lg'
        }}
        onClick={() => signIn()}
      >
        Sign in
      </Button>
    </Box>
  )
};

export default Home;

