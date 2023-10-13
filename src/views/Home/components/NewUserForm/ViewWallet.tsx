import React from 'react';

interface UserInfo {
  address: string;
  secretWords: string[];
}

interface ViewWalletProps {
  userInfo: UserInfo;
  isLoadingUserInfo: boolean;
}

const ViewWallet: React.FC<ViewWalletProps> = ({ userInfo, isLoadingUserInfo }) => {
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
