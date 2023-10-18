import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Flex, VStack, Text, HStack, Grid, Stack, Box } from "@chakra-ui/react";
interface UserInfo {
  address: string;
  secretWords: string[];
}

interface ViewWalletProps {
  userInfo: UserInfo;
  isLoadingUserInfo: boolean;
  jsonPrettyData: string;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ userInfo, isLoadingUserInfo, jsonPrettyData }) => {
  const [parsedData, setParsedData] = useState<any | null>(null);

  useEffect(() => {
    if (jsonPrettyData !== '') {
      setParsedData(JSON.parse(jsonPrettyData));
    }
  }, [jsonPrettyData]);

  const handleDownload = () => {
    if (parsedData) {
      const jsonContent = JSON.stringify(parsedData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${userInfo.address}.json`;

      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Box>
      {isLoadingUserInfo ? (
        <p>Loading user info...</p>
      ) : (
        <Flex
        direction={'column'}
        alignItems={'flex-start'}
        textAlign={'left'}
        gap={4}
        >
          <Text>View Wallet</Text>
          <Text>Address: {userInfo.address}</Text>
          {parsedData !== null && (
            <Box>
              <Button 
                onClick={handleDownload}
                border={'1px solid black'}
                background={'black'}
                color={'white'}
                _hover={{ background: 'white', color: 'black' }}
                outline={'none'}
                _active={{ outline: 'none' }}
                >Download JSON</Button>
            </Box>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default ViewWallet;