import React, { useState } from 'react';
import { useEffect } from 'react';
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
      a.download = 'file.json';

      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      {isLoadingUserInfo ? (
        <p>Loading user info...</p>
      ) : (
        <div>
          <h1>View Wallet</h1>
          <p>Address: {userInfo.address}</p>
          {parsedData !== null && (
            <div>
              <button onClick={handleDownload}>Download JSON</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};