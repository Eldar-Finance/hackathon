import React, { ChangeEvent } from 'react';
import { Input } from '@chakra-ui/react';
interface CreatePinProps {
    setPin: React.Dispatch<React.SetStateAction<string>>;
}
function CreatePin({ setPin }: CreatePinProps) {
    const handlePinChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPin(event.target.value);
    }
    return (
        <Input placeholder='Type your pin' onChange={handlePinChange} />
    );
}
export default CreatePin;