import { useSession, signIn, signOut } from "next-auth/react"
import { Button, Box } from "@chakra-ui/react";
import CreateWallet from "./CreateWallet/CreateWallet";

export default function Home() {

  const { data: session } = useSession()
  console.log(session);

  if (session) {
    return (
      <Box>
        Signed in as {session?.user?.email} <br />
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
        <CreateWallet/>
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
}
