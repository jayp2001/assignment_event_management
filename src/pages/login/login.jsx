import './login.css';
import React from 'react';
import logo from '../../assets/logo/logo.svg';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from "@mui/material/FormControl";
import TextField from '@mui/material/TextField';
import { BACKEND_BASE_URL } from '../../assets/url/endpoint';
import Alert from '@mui/material/Alert';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [errorData, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userNameError, setUserNameError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const submit = async (e) => {
        e.preventDefault();
        if (userName && password) {
            const data = {
                role: userName,
                code: password
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            await axios.post(`${BACKEND_BASE_URL}users/login`, data, config)
                .then((res) => {
                    setLoading(false);
                    if (res && res.data ? true : false) {
                        setSuccess(true);
                        setError('')
                        console.log('res>>', res.data)
                        localStorage.setItem("userInfo", JSON.stringify(res.data));
                        navigate('/eventList');
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.message && error.message ? error.message : "Network Error ...!!!");
                })
        }
        else {
            if (!userName) {
                setUserNameError(true)
                setError('please enter credential')
            }
            else {
                setUserNameError(false)
                setError('')
            }
            if (!password) {
                setPasswordError(true)
                setError('please enter credential')
            }
            else {
                setPasswordError(false)
                setError('')
            }
        }
    }
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))
    }, []);
    return (
        <div className="grid grid-rows-1 tablet:h-screen tablet:pb-0 tablet:pt-0 tablet1:h-screen tablet1:pb-0  tablet1:pt-0 mobile:h-screen mobile:pb-20 loginContainer">
            <div className="grid grid-cols-12 h-full grid content-center">
                <div className="tablet:col-span-6 tablet1:col-span-6 mobile:col-span-12 flex items-center justify-around">
                    <div className='grid grid-cols-12'>
                        <div className='tablet1:col-span-8 mobile:col-start-4 mobile:col-span-6 tablet1:col-start-3'>
                            <div className="logoMobile">
                                <img src={logo} alt="bhagwati logo" style={{ width: '300px' }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tablet1:col-span-6 mobile:col-span-12 tablet:h-full tablet1:h-fit tablet1:pb-6 tablet1:pt-6 grid content-center">
                    <div className="grid grid-cols-12">
                        <div className="tablet1:col-span-8 mobile:col-span-10 mobile:col-start-2 tablet1:col-start-3">
                            <div className="loginCard">
                                <div className='loginHeader'>
                                    Login
                                </div>
                                <div className='textFieldWrp grid gap-6'>
                                    {errorData &&
                                        <div>
                                            <Alert severity="error">{errorData}</Alert>
                                        </div>
                                    }
                                    <TextField
                                        required
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                            if (e.target.value) {
                                                setUserNameError(false)
                                            } else {
                                                setUserNameError(true)
                                            }
                                        }
                                        }
                                        // onChange={onChange}
                                        value={userName}
                                        error={userNameError}
                                        autoComplete='off'
                                        name="agentFirstName"
                                        id="outlined-required"
                                        label="User Name"
                                        InputProps={{ style: { fontSize: 18 } }}
                                        InputLabelProps={{ style: { fontSize: 18 } }}
                                        fullWidth
                                    />
                                    <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">
                                            Password
                                        </InputLabel>
                                        <OutlinedInput
                                            name="agentFirstName"
                                            autoComplete='off'
                                            label="Password"
                                            error={passwordError}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                if (e.target.value) {
                                                    setPasswordError(false)
                                                } else {
                                                    setPasswordError(true)
                                                }
                                            }}
                                            InputProps={{ style: { fontSize: 18 } }}
                                            InputLabelProps={{ style: { fontSize: 18 } }}
                                            fullWidth
                                            onKeyDown={(e) => {
                                                e.key === 'Enter' ? submit(e) : <></>
                                            }}
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </div>
                                <div className="buttonWrapper flex justify-around pb-4">
                                    <button className="loginBtn" type="submit" onClick={(e) => submit(e)}>
                                        Login In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;