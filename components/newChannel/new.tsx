import { Button } from '@/components/ui/button';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon/index.web';
import { Input, InputField } from '@/components/ui/input';
import { useState } from 'react';
import { View, } from 'react-native';
export default function NewChannel() {
    const [channelName, setChannelName] = useState('');
    const [channelDescription, setChannelDescription] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const handleCreateChannel = () => {
        if (channelName.trim().length === 0) {
            setIsInvalid(true);
            return;
        }
        setIsInvalid(false);
        // Logic to handle channel creation
        console.log('Channel Created:', { channelName, channelDescription });
    };

    return (
        <View className="flex-1 flex-col bg-gray-50 dark:bg-gray-900 p-4">
            <FormControl
                isInvalid={isInvalid}
                size="md"
                isRequired
            >
                <FormControlLabel>
                    <FormControlLabelText>Channel Name</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                    <InputField
                        type="text"
                        placeholder="Enter channel name"
                        value={channelName}
                        onChangeText={(text) => setChannelName(text)}
                    />
                </Input>
                {isInvalid && (
                    <FormControlError>
                        <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                        <FormControlErrorText className="text-red-500">
                            Channel name is required.
                        </FormControlErrorText>
                    </FormControlError>
                )}
            </FormControl>

            <FormControl size="md">
                <FormControlLabel>
                    <FormControlLabelText>Channel Description</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                    <InputField
                        type="text"
                        placeholder="Enter channel description"
                        value={channelDescription}
                        onChangeText={(text) => setChannelDescription(text)}
                    />
                </Input>
                <FormControlHelper>
                    <FormControlHelperText>
                        Optional: Provide a brief description of the channel.
                    </FormControlHelperText>
                </FormControlHelper>
            </FormControl>

            <Button className="mt-4" onPress={handleCreateChannel}>
                Create Channel
            </Button>
        </View>
    );
}