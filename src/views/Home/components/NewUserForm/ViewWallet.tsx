import React from 'react';

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

  const parsedData = JSON.parse(jsonPrettyData);

  console.log("parsed data", parsedData)

  return (
    <div>
      {isLoadingUserInfo ? (
        <p>Loading user info...</p>
      ) : (
        <div>
          <h1>View Wallet</h1>
          <p>Address: {userInfo.address}</p>
          <p>Secret Words: {userInfo.secretWords.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default ViewWallet;
