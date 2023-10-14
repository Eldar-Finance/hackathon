import { useSession, signOut } from "next-auth/react"
import { useGetUserInfo } from "@/views/Home/hooks/hooks";
import NewUserForm from "./components/NewUserForm/NewUserForm";
import ExistingUser from "./components/ExistingUser/ExistingUser";
import { Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import LandingPage from "./components/LandingPage/LandingPage";

const Home = () => {

  const { data: session } = useSession()

  const email = session?.user?.email || "";
  const platform = "google";

  const { userInfo, isLoadingUserInfo, errorUserInfo } = useGetUserInfo(email, platform);

  const [clickedSubmit, setClickedSubmit] = useState(false);

  let userExists = false;
  if (!isLoadingUserInfo && session && userInfo?.address != "") {
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
         {userExists && !clickedSubmit ?
          <ExistingUser email={session?.user?.email} address={userInfo?.address || ""} secretWords={userInfo?.secretWords || []} userGid={session?.user?.sub}/>
          :
          <NewUserForm email={email} userGid={session?.user?.sub} setClickedSubmit={setClickedSubmit} />
        } 
      </Box>
    )
  }

  return (
    <LandingPage />
  )
};

export default Home;