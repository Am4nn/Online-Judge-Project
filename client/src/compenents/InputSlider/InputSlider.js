import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

import TextFields from '@mui/icons-material/TextFields';

const Input = styled(MuiInput)`
  width: 42px;
`;

const InputSlider = ({ codeFontSize: value, setcodeFontSize: setValue }) => {

    const maxVal = 50, minVal = 5;

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < minVal) {
            setValue(minVal);
        } else if (value > maxVal) {
            setValue(maxVal);
        }
    };

    return (
        <Box sx={{ width: 250, marginRight: '1rem' }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextFields />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={minVal}
                        max={maxVal}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: minVal,
                            max: maxVal,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default InputSlider;