import { Button } from "@chakra-ui/react";
import { Mnemonic, UserWallet } from "@multiversx/sdk-wallet";

const CreateWallet = () => {
    
    // const handleClickCreateWallet = () => {
        console.log("WALLET CREATION STARTED");
        
        let mnemonic = Mnemonic.generate();
        // let words = mnemonic.getWords();
        // console.log("⚠️ ~ file: CreateWallet.tsx:9 ~ handleClickCreateWal ~ words::::", words)
        // let mnemonicString = mnemonic.toString();
        // console.log("⚠️ ~ file: CreateWallet.tsx:11 ~ handleClickCreateWal ~ mnemonicString::::", mnemonicString)
        // let mnemonicKey = mnemonic.deriveKey();
        // console.log("⚠️ ~ file: CreateWallet.tsx:13 ~ handleClickCreateWal ~ mnemonicKey::::", mnemonicKey)
        
        const password = "password";
        const addressIndex = 0;
    
        // const secretKey = mnemonic.deriveKey(addressIndex);
        // const userWallet = UserWallet.fromSecretKey({ secretKey, password });
        // const jsonFileContent = userWallet.toJSON();
        // const jsonPretty = JSON.stringify(jsonFileContent);
        
        // console.log("⚠️ ~ file: CreateWallet.tsx:22 ~ handleClickCreateWal ~ jsonPretty::::", jsonPretty)
    // }

    return (
        <>
            <h1>Create Wallet:</h1>
            <Button
                // onClick={() => handleClickCreateWallet}
            >
                Create
            </Button>
        </>
    );
}

export default CreateWallet;