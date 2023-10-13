import { useSession, signIn, signOut } from "next-auth/react"
import { Button, Box, useBreakpointValue } from "@chakra-ui/react";
import { useGetUserInfo } from "@/views/Home/hooks/hooks";
import NewUserForm from "./components/NewUserForm/NewUserForm";
import withDappProvider from "@/hoc/withDappProvider";
import ExistingUser from "./components/ExistingUser/ExistingUser";
import {
  Flex,
  Heading,
  Text,
  Link,
  SimpleGrid,
  Stack,
  Icon,
  Spacer,VStack,Grid
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon, CheckIcon } from "@chakra-ui/icons";
import { useCallback } from "react";
import Particles from "react-particles";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";



interface FeatureCardProps {
  icon: React.ComponentType; // Specify the type for the 'icon' prop
  title: string; // Specify the type for the 'title' prop
  description: string; // Specify the type for the 'description' prop
}

function FeatureCard({ icon: IconComponent, title, description }: FeatureCardProps) {
  return (
    <div>
      {/* Render your component using IconComponent, title, and description */}
      <IconComponent />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

const Home = () => {
  
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
}, []);
  const columnCount = useBreakpointValue({ base: 2, md: 4 }); // Two columns for mobile, four columns for larger screens


  const { data: session } = useSession()

  const email = session?.user?.email || "";
  const platform = "google";

  const {userInfo, isLoadingUserInfo, errorUserInfo} = useGetUserInfo(email, platform);

  let userExists = false;
  let walletExists = false;
  if (!isLoadingUserInfo && session && userInfo?.address != "") {
    userExists = true;
    walletExists = true;
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
         {userExists && walletExists ?
          <ExistingUser email={session?.user?.email} address={userInfo?.address || ""} secretWords={userInfo?.secretWords || []} userGid={session?.user?.sub}/>
          :
          <NewUserForm email={email} userGid={session?.user?.sub}/>
        } 
       {/* <NewUserForm email={email} userGid={session?.user?.sub}/>*/}
      </Box>
    )
  }
  return (

    

    <Box
    bgGradient="linear(to-b, black, purple.700)" // Gradient background
    minHeight="100vh"
    px={10}
    py={5}
    position="relative"
    
  >

<Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                background: {
                    color: {
                        value: "#121212",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 220,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1.2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 700,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.3,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />

      
      {/* Header */}
      <Flex
      style={{ zIndex: 1 }}
      alignItems="center"
      maxWidth="1200px"
      mx="auto"
      flexDirection={['column', 'column', 'row']} // Use column layout for mobile and row layout for larger screens
      textAlign={['center', 'center', 'left']} // Center text for mobile and left-align for larger screens
    >
      {/* Logo */}
      <Heading color="white" size="lg" letterSpacing="tighter" style={{ zIndex: 1 }}>
        SociWallet
      </Heading>

      {/* Spacer for mobile */}
      <Spacer display={['none', 'none', 'block']} style={{ zIndex: 1 }}/>

      {/* Nav Links */}
      <Flex
      style={{ zIndex: 1 }}
        as="nav"
        flexWrap={['wrap', 'wrap', 'nowrap']} // Wrap links for mobile and no wrap for larger screens
        justifyContent={['center', 'center', 'flex-start']} // Center links for mobile and left-align for larger screens
        mt={[4, 4, 0]} // Add margin-top for mobile
      >
        <Link mx={3} color="gray.300" _hover={{ color: 'white' }}>
          How it works
        </Link>
        <Link mx={3} color="gray.300" _hover={{ color: 'white' }}>
          SociWallet SDK
        </Link>
        <Link mx={3} color="gray.300" _hover={{ color: 'white' }}>
          Documentation
        </Link>
        <Link mx={3} color="gray.300" _hover={{ color: 'white' }}>
          About us
        </Link>
      </Flex>
    </Flex>
      
      {/* ... rest of the page content */}

      {/* Hero Section */}
      <Flex
      style={{ zIndex: 1 }}
      direction="row"
      alignItems="center"
      justifyContent="center"
      height="60vh"
      mt={20}
    >
      
      {/* Content */}
      <Flex
      style={{ zIndex: 1 }}
        direction="column"
        alignItems="start" // Left-align content
        textAlign="left" // Left-align text
        maxWidth={['100%', '100%', '40%']} // Adjust width for mobile and larger screens
        px={[4, 4, 0]} // Add horizontal padding for mobile
      >
        <Heading as="h1" color="white" fontSize="6xl" mb={4}>The SociWallet</Heading>
        <Text color="gray.300" mb={10}>
          Create a secure MultiversX wallet in moments with your Google account and a secret PIN. Your PIN, exclusively for seed phrase encryption, is not stored anywhere. Access your seed phrase with your PIN whenever needed, giving you freedom and peace of mind.
        </Text>
        <Flex>
          <Button
            mt={3}
            colorScheme="teal"
            _hover={{
              opacity: 1,
              boxShadow: 'lg'
            }}
            onClick={() => signIn()}
          >
            Create Wallet
          </Button>
          <Button
            mt={3}
            ml={3} // Add margin to the right of the button
            colorScheme="teal"
            variant="outline"
          >
            Access Existing
          </Button>
        </Flex>
      </Flex>
    </Flex>


      {/* Stats Section */}
      <Grid
      style={{ zIndex: 1 }}
      templateColumns={`repeat(${columnCount}, 1fr)`}
      gap={8}
      maxWidth="1200px"
      mx="auto"
      mt={16}
      alignItems="center"
    >

      
      {/* Stat Item 1 */}
      <VStack>
        <Text color="gray.200" fontSize={['2xl', '3xl']}>562M</Text>
        <Text color="gray.300">of active daily users</Text>
      </VStack>

      {/* Stat Item 2 */}
      <VStack>
        <Text color="gray.200" fontSize={['2xl', '3xl']}>1234</Text>
        <Text color="gray.300">transactions per second</Text>
      </VStack>

      {/* Stat Item 3 */}
      <VStack>
        <Text color="gray.200" fontSize={['2xl', '3xl']}>11236</Text>
        <Text color="gray.300">validator nodes</Text>
      </VStack>

      {/* Stat Item 4 */}
      <VStack>
        <Text color="gray.200" fontSize={['2xl', '3xl']}>2M</Text>
        <Text color="gray.300">transactions per day</Text>
      </VStack>
    </Grid>

    

         {/* Key Features Section */}
  <Box maxWidth="1200px" mx="auto" my={20} style={{ zIndex: 1 }}>
    <Heading as="h2" color="white" fontSize="3xl" mb={6}>
      Key features that set us apart
    </Heading>
    <Text color="gray.300" mb={10}>
      Nexowallet is more than just a wallet - its a comprehensive platform with features that are tailored to the needs of cryptocurrency enthusiasts
    </Text>

    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
      <FeatureCard
        icon={AtSignIcon}
        title="Multi-currency support"
        description="Our platform supports a wide range of currencies, including Bitcoin, Ethereum, Litecoin, and more."
      />
      <FeatureCard
        icon={LockIcon}
        title="Secure storage"
        description="Digital assets are stored securely in our offline storage. They're protected from hacking attempts."
      />
      <FeatureCard
        icon={CheckIcon}
        title="Easy transactions"
        description="Sending & receiving cryptocurrency has never been easier. Make transactions with just a few clicks."
      />
      {/* ... other feature cards */}
    </SimpleGrid>
  </Box>


    </Box>

    
     )

    
    

    
};

export default Home;