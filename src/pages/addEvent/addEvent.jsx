import './addEvent.css'
import React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { InputLabel, FormControl, OutlinedInput, Typography, FormControlLabel, Checkbox } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import WifiIcon from '@mui/icons-material/Wifi';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { useNavigate } from 'react-router-dom';
import img1 from '../../assets/img/img1.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageOutlined } from '@mui/icons-material';
import axios from 'axios';
import { BACKEND_BASE_URL } from '../../assets/url/endpoint';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function AddEvent() {
    const regex = /^[0-9\b]+$/;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [selectedCourt, setSelectedCourt] = useState([])
    const [formData, setFormData] = useState({
        eventName: "",
        eventFormat: "Public",
        type: "",
        avgAmount: '',
        status: "",
        payment: "Online",
        hours: "1-2",
        date: null,
        fromTime: "",
        toTime: "",
        noOfParticipants: "",
        court: [],
        totalWorkers: "",
        totalWorkerHours: "",
        employeeSalary: 0,
        amount: "",
        gender: "",
        ageGroup: [],
        paymentStatus: "",
        food: [],
        foodCost: "",
        description: "",
        contactPerson: "",
        contactNumber: "",
        contactEmail: "",
        needPhotographer: false,
        sendSurvey: false,
        surveyQuestion: "",
        adminRemark: "",
        lead: ""
    })
    const [formDataError, setFormDataError] = useState({
        eventName: false,
        eventFormat: false,
        type: false,
        status: false,
        payment: false,
        date: false,
        fromTime: false,
        toTime: false,
        noOfParticipants: false,
        court: false,
        amount: false,
        gender: false,
        ageGroup: false,
        paymentStatus: false,
        food: false,
        contactPerson: "",
        contactNumber: "",
    })
    const [fields, setFields] = useState([
        'eventName',
        'eventFormat',
        'type',
        'status',
        'payment',
        'date',
        'fromTime',
        'toTime',
        'noOfParticipants',
        'court',
        'amount',
        'gender',
        'ageGroup',
        'paymentStatus',
        'food',
        'contactPerson',
        'contactNumber',
        'lead'
    ])

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const navigate = useNavigate();

    const handleNoOfWorkerChange = (e, indexToedit) => {
        setSelectedCourt(
            selectedCourt?.map((data, index) =>
                index == indexToedit ? { ...data, noOfWorkers: e.target.value ? e.target.value : 0 } : data
            ))
    }
    const handleValueChangeRequired = (e) => {
        if (e.target.name == 'amount') {
            if (formData.noOfParticipants && e.target.value) {
                setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                    avgAmount: parseFloat(parseFloat(e.target.value) / parseFloat(formData.noOfParticipants)).toFixed(2)
                }))
                setFormDataError((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value ? false : true
                }))
            } else {
                setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                    avgAmount: ''
                }))
                setFormDataError((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value ? false : true
                }))
            }
        } else if (e.target.name == 'noOfParticipants') {
            if (formData.amount && e.target.value) {
                setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                    avgAmount: parseFloat(parseFloat(e.target.value) / parseFloat(formData.noOfParticipants)).toFixed(2)
                }))
                setFormDataError((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value ? false : true
                }))
            }
            else {
                setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                    avgAmount: ''
                }))
                setFormDataError((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value ? false : true
                }))
            }
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
            setFormDataError((prev) => ({
                ...prev,
                [e.target.name]: e.target.value ? false : true
            }))
        }
    }
    const handleValueChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleChangeAgeGroup = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            ageGroup: typeof value === 'string' ? value.split(',') : value,
        }));
        setFormDataError((prev) => ({
            ...prev,
            ageGroup: typeof value === 'string' ? value ? false : true : value ? false : true,
        }));
    };
    const handleChangeCourt = (event) => {
        // console.log('courts', event.target.value)
        if (event.target.value && event.target.value?.length > 0) {
            setSelectedCourt(
                event.target.value?.map((data) => ({
                    name: data,
                    noOfWorkers: 0
                }))
            )
        } else {
            setSelectedCourt(
                []
            )
        }
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            court: typeof value === 'string' ? value.split(',') : value,
        }));
        setFormDataError((prev) => ({
            ...prev,
            court: typeof value === 'string' ? value ? false : true : value ? false : true,
        }));
    };
    const handleChangeFood = (event) => {
        const {
            target: { value },
        } = event;
        setFormData((prev) => ({
            ...prev,
            food: typeof value === 'string' ? value.split(',') : value,
        }));
        setFormDataError((prev) => ({
            ...prev,
            food: typeof value === 'string' ? value ? false : true : value ? false : true,
        }));
    };
    const handleDate = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["date"]: date && date['$d'] ? date['$d'] : null,
        }))
        setFormDataError((prev) => ({
            ...prev,
            date: date && date['$d'] ? false : true,
        }))
    };
    const handleFrom = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["fromTime"]: date && date['$d'] ? date['$d'] : null,
        }))
        setFormDataError((prev) => ({
            ...prev,
            fromTime: date && date['$d'] ? false : true,
        }))
    };
    const handleTo = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["toTime"]: date && date['$d'] ? date['$d'] : null,
        }))
        setFormDataError((prev) => ({
            ...prev,
            toTime: date && date['$d'] ? false : true,
        }))
    };
    const addEvent = async () => {
        setLoading(true);
        const finalData = {
            ...formData,
            court: selectedCourt
        }
        await axios.post(`${BACKEND_BASE_URL}events/create`, finalData, config)
            .then((res) => {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/eventList')
                }, 500)
            })
            .catch((error) => {
                setError("Error ...!!!");
            })
    }
    const submit = () => {
        if (loading || success) {

        } else {
            const isValidate = fields.filter(element => {
                if (formDataError[element] === true || formData[element] == '' || !formData[element]) {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            if (isValidate.length > 0) {
                console.log('error fields', isValidate)
                setError(
                    "Please Fill All Field"
                )
            } else {
                addEvent();
            }
        }
    }
    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "top-right",
                toastId: 'error',
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false)
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            toastId: 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setError(false);
    }
    return (
        <div className='listContainer'>
            <div className='tabHeader'>
                Create Event
            </div>
            <div className="grid grid-cols-1 tablet1:grid-cols-3 tablet:grid-cols-2 mainFormContainer gap-4">
                <div className="formConatiner tablet1:col-span-2 tablet:col-span-1">
                    <div>
                        <div className="fieldHeader">
                            Event name
                        </div>
                        <TextField id="outlined-basic"
                            variant="outlined"
                            size='small'
                            value={formData.eventName}
                            placeholder='Event Name'
                            name='eventName'
                            onChange={handleValueChangeRequired}
                            error={formDataError.eventName}
                            helperText={formDataError.eventName ? 'Pls enter event name' : ''}
                            InputProps={{ sx: { borderRadius: '12px' } }}
                            fullWidth
                        />
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Event Format
                        </div>
                        <div className='flex gap-4'>
                            <div className={formData.eventFormat == 'Public' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    eventFormat: 'Public'
                                }))
                            }}>
                                <GroupsIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Public
                            </div>
                            <div className={formData.eventFormat == 'Global' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    eventFormat: 'Global'
                                }))
                            }}>
                                <LanguageIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Global
                            </div>
                            <div className={formData.eventFormat == 'Local' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    eventFormat: 'Local'
                                }))
                            }}>
                                <PersonIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Local
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-6'>
                        <div>
                            <div className="fieldHeader">
                                Event Type
                            </div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.type}
                                name='type'
                                onChange={handleValueChangeRequired}
                                error={formDataError.type}
                                displayEmpty
                                renderValue={(value) => {
                                    if (!value) {
                                        return <Typography color="gray">Select Type</Typography>;
                                    }
                                    return value;
                                }}
                                size='small'
                                fullWidth
                                style={{ borderRadius: '12px' }}
                            // onChange={handleChange}
                            >
                                <MenuItem value={'Private'}>Private</MenuItem>
                                <MenuItem value={'Public'}>Public</MenuItem>
                                <MenuItem value={'Expo'}>Expo</MenuItem>
                            </Select>
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Event Status
                            </div>
                            <FormControl className='w-full'>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.status}
                                    name='status'
                                    error={formDataError.status}
                                    onChange={handleValueChangeRequired}
                                    displayEmpty
                                    renderValue={(value) => {
                                        if (!value) {
                                            return <Typography color="gray">Select Status</Typography>;
                                        }
                                        return value;
                                    }}
                                    size='small'
                                    placeholder='Event Status'
                                    fullWidth
                                    style={{ borderRadius: '12px' }}
                                // onChange={handleChange}
                                >
                                    <MenuItem value={'Contract'}>Contract</MenuItem>
                                    <MenuItem value={'TEST1'}>TEST1</MenuItem>
                                    <MenuItem value={'TEST2'}>TEST2</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Date
                            </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14, width: '100%' } }}
                                    sx={{ width: "100% " }}
                                    size='small'
                                    inputFormat="DD/MM/YYYY"
                                    onChange={handleDate}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            error: formDataError.date,
                                            InputProps: {
                                                sx: { borderRadius: '12px', backgroundColor: 'white' }, // Apply the styles here
                                            },
                                        },
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth size='small' sx={{ width: '100%', borderRadius: '12px' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                        <div>
                            <div className='grid grid-cols-12 gap-4'>
                                <div className='col-span-5'>
                                    <div className="fieldHeader">
                                        From
                                    </div>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileTimePicker
                                                fullWidth
                                                placeholder='From'
                                                onChange={handleFrom}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        error: formDataError.fromTime,
                                                        InputProps: {
                                                            sx: { borderRadius: '12px', backgroundColor: 'white' }, // Apply the styles here
                                                        },
                                                    },
                                                }}
                                                size='small'
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className='col-span-2 text-center flex'>
                                    <div className='self-center w-full mt-4'>
                                        --
                                    </div>
                                </div>
                                <div className='col-span-5'>
                                    <div className="fieldHeader">
                                        To
                                    </div>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileTimePicker
                                                fullWidth
                                                placeholder='From'
                                                onChange={handleTo}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small',
                                                        error: formDataError.toTime,
                                                        InputProps: {
                                                            sx: { borderRadius: '12px', backgroundColor: 'white' }, // Apply the styles here
                                                        },
                                                    },
                                                }}
                                                size='small'
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Gender
                            </div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={formData.gender}
                                name='gender'
                                onChange={handleValueChangeRequired}
                                error={formDataError.gender}
                                displayEmpty
                                renderValue={(value) => {
                                    if (!value) {
                                        return <Typography color="gray">Select Gender</Typography>;
                                    }
                                    return value;
                                }}
                                size='small'
                                fullWidth
                                style={{ borderRadius: '12px' }}
                            // onChange={handleChange}
                            >
                                <MenuItem value={'Male'}>Male</MenuItem>
                                <MenuItem value={'Female'}>Female</MenuItem>
                                <MenuItem value={'Other'}>Other</MenuItem>
                            </Select>
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Age Group
                            </div>
                            <Select
                                id="demo-multiple-checkbox"
                                multiple
                                value={formData.ageGroup}
                                onChange={handleChangeAgeGroup}
                                // input={<OutlinedInput label="Tag" />}
                                error={formDataError.ageGroup}
                                MenuProps={MenuProps}
                                displayEmpty
                                renderValue={(value) => {
                                    if (!value) {
                                        return <Typography color="gray">Select Age</Typography>;
                                    }
                                    return value.join(', ');
                                }}
                                size='small'
                                fullWidth
                                style={{ borderRadius: '12px' }}
                            // onChange={handleChange}
                            >
                                <MenuItem value={'14-18'}>14-18</MenuItem>
                                <MenuItem value={'18-30'}>18-30</MenuItem>
                                <MenuItem value={'30-45'}>30-45</MenuItem>
                                <MenuItem value={'45-60'}>45-60</MenuItem>
                            </Select>
                        </div>
                        <div>
                            <div className="fieldHeader">
                                No. of Participants
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                size='small'
                                name='noOfParticipants'
                                value={formData.noOfParticipants}
                                onChange={(e) => {
                                    if ((regex.test(e.target.value) || e.target.value === '')) {
                                        handleValueChangeRequired(e)
                                    }
                                }
                                }
                                error={formDataError.noOfParticipants}
                                placeholder='Enter no. of participants'
                                InputProps={{ sx: { borderRadius: '12px' } }}
                                fullWidth
                            />
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Court
                            </div>
                            <Select
                                id="demo-multiple-checkbox"
                                multiple
                                value={formData.court}
                                onChange={handleChangeCourt}
                                error={formDataError.court}
                                // input={<OutlinedInput label="Tag" />}
                                MenuProps={MenuProps}
                                displayEmpty
                                renderValue={(value) => {
                                    if (!value) {
                                        return 'Select Court'
                                    }
                                    return value.join(', ');
                                }}
                                size='small'
                                fullWidth
                                style={{ borderRadius: '12px' }}
                            // onChange={handleChange}
                            >
                                <MenuItem value={'Gold 1'}>Gold 1</MenuItem>
                                <MenuItem value={'Gold 2'}>Gold 2</MenuItem>
                                <MenuItem value={'Gold 3'}>Gold 3</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 mt-6'>
                        <div>
                            {selectedCourt && selectedCourt.length > 0 && <>
                                <div className="fieldHeader">
                                    No. of workers
                                </div>
                                <div className='grid grid-cols-2 gap-4' >
                                    {selectedCourt.map((data, index) => (
                                        <div className='flex' key={'court' + index}>
                                            <div className='w-full'>
                                                <OutlinedInput
                                                    id="outlined-adornment-weight"
                                                    size='small'
                                                    fullWidth
                                                    value={data.noOfWorkers}
                                                    onChange={(e) => handleNoOfWorkerChange(e, index)}
                                                    error={formDataError.amount}
                                                    placeholder='Enter No. of Worker'
                                                    helperText={formDataError.amount ? 'Pls enter amount' : ''}
                                                    sx={{ borderRadius: '12px' }}
                                                    endAdornment={<InputAdornment position="end">
                                                        <div className='courtNameDiv flex gap-3'>
                                                            <div className='polygon self-center'>
                                                                <div className='inner'>
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                            <div className='self-center'>
                                                                {data.name}
                                                            </div>
                                                        </div>
                                                    </InputAdornment>}
                                                    aria-describedby="outlined-weight-helper-text"
                                                    inputProps={{
                                                        'aria-label': 'weight',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                    }
                                </div>
                            </>}
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Payment
                        </div>
                        <div className='flex gap-4'>
                            <div className={formData.payment == 'Online' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    payment: 'Online'
                                }))
                            }}>
                                <WifiIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Online
                            </div>
                            <div className={formData.payment == 'Offline' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    payment: 'Offline'
                                }))
                            }}>
                                <WifiOffIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Offline
                            </div>
                            <div className={formData.payment == 'Free' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    payment: 'Free'
                                }))
                            }}>
                                <MoneyOffIcon fontSize='small' style={{ position: 'relative', top: '-1px' }} /> &nbsp;&nbsp;Free
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Payment Status
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.paymentStatus}
                            name='paymentStatus'
                            onChange={handleValueChangeRequired}
                            error={formDataError.paymentStatus}
                            displayEmpty
                            renderValue={(value) => {
                                if (!value) {
                                    return <Typography color="gray">Select status</Typography>;
                                }
                                return value;
                            }}
                            size='small'
                            fullWidth
                            style={{ borderRadius: '12px' }}
                        // onChange={handleChange}
                        >
                            <MenuItem value={'Paid'}>Paid</MenuItem>
                            <MenuItem value={'Pendding'}>Pendding</MenuItem>
                        </Select>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-6'>
                        <div>
                            <div className="fieldHeader">
                                Amount
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                name='amount'
                                value={formData.amount}
                                onChange={
                                    (e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '')) {
                                            handleValueChangeRequired(e);
                                        }
                                    }}
                                error={formDataError.amount}
                                helperText={formDataError.amount ? 'Pls enter amount' : ''}
                                size='small'
                                placeholder='Enter Amount'
                                InputProps={{ sx: { borderRadius: '12px' } }}
                                fullWidth
                            />
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Average payment per Participants
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                size='small'
                                disabled
                                value={formData.avgAmount}
                                // placeholder='Enter no. of participants'
                                InputProps={{ sx: { borderRadius: '12px', background: 'rgba(0,0,0,0.05)' } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Food
                        </div>
                        <Select
                            id="demo-multiple-checkbox"
                            multiple
                            value={formData.food}
                            error={formDataError.food}
                            onChange={handleChangeFood}
                            MenuProps={MenuProps}
                            displayEmpty
                            renderValue={(value) => {
                                if (!value) {
                                    return 'Select Court'
                                }
                                return value.join(', ');
                            }}
                            size='small'
                            fullWidth
                            style={{ borderRadius: '12px' }}
                        // onChange={handleChange}
                        >
                            <MenuItem value={'Lunch'}>Lunch</MenuItem>
                            <MenuItem value={'Snacks'}>Snacks</MenuItem>
                            <MenuItem value={'Diner'}>Diner</MenuItem>
                        </Select>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Description
                        </div>
                        <TextField id="outlined-basic"
                            variant="outlined"
                            size='small'
                            value={formData.description}
                            onChange={handleValueChange}
                            name="description"
                            placeholder='Enter description'
                            InputProps={{ sx: { borderRadius: '12px' } }}
                            fullWidth
                        />
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Actual hours in the place
                        </div>
                        <div className='flex gap-4'>
                            <div
                                className={formData.hours == '1-2' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        hours: '1-2'
                                    }))
                                }}>
                                1-2
                            </div>
                            <div className={formData.hours == '2-3' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    hours: '2-3'
                                }))
                            }}>
                                2-3
                            </div>
                            <div className={formData.hours == '3-4' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    hours: '3-4'
                                }))
                            }}>
                                3-4
                            </div>
                            <div className={formData.hours == '4+x' ? 'customRadioBtnActive' : 'customRadioBtn'} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    hours: '4+'
                                }))
                            }}>
                                4+
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            <FormControlLabel control={<Checkbox style={{
                                color: 'rgba(219, 84, 93, 1)',
                                borderRadius: '10px'
                            }} checked={formData.needPhotographer} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    needPhotographer: !formData.needPhotographer
                                }))
                            }} />} label="Need a photographer" />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <div>
                            <div className="fieldHeader">
                                Contact person
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                size='small'
                                value={formData.contactPerson}
                                name='contactPerson'
                                onChange={handleValueChangeRequired}
                                error={formDataError.contactPerson}
                                helperText={formDataError.contactPerson ? 'Pls enter person name' : ''}
                                placeholder='Enter person name'
                                InputProps={{ sx: { borderRadius: '12px' } }}
                                fullWidth
                            />
                        </div>
                        <div>
                            <div className="fieldHeader">
                                Contact number
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                size='small'
                                value={formData.contactNumber}
                                name='contactNumber'
                                onChange={
                                    (e) => {
                                        if ((regex.test(e.target.value) || e.target.value === '') && e.target.value.length < 11) {
                                            handleValueChangeRequired(e)
                                        }
                                    }
                                }
                                error={formDataError.contactNumber}
                                helperText={formDataError.contactNumber ? 'Pls enter person number' : ''}
                                placeholder='Enter contact number'
                                InputProps={{ sx: { borderRadius: '12px' } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Contact Email ID
                        </div>
                        <TextField id="outlined-basic"
                            variant="outlined"
                            size='small'
                            value={formData.contactEmail}
                            name='contactEmail'
                            onChange={handleValueChange}
                            placeholder='Enter email ID'
                            InputProps={{ sx: { borderRadius: '12px' } }}
                            fullWidth
                        />
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            How did you find our lead?
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.lead}
                            name='lead'
                            onChange={handleValueChangeRequired}
                            error={formDataError.lead}
                            displayEmpty
                            renderValue={(value) => {
                                if (!value) {
                                    return <Typography color="gray">Select lead</Typography>;
                                }
                                return value;
                            }}
                            size='small'
                            fullWidth
                            style={{ borderRadius: '12px' }}
                        // onChange={handleChange}
                        >
                            <MenuItem value={'Instagarm'}>Instagarm</MenuItem>
                            <MenuItem value={'Facebook'}>Facebook</MenuItem>
                            <MenuItem value={'Twitter'}>Twitter</MenuItem>
                        </Select>
                    </div>
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            <FormControlLabel control={<Checkbox sx={{
                                color: 'rgba(219, 84, 93, 1)',
                                '&.Mui-checked': {
                                    color: 'rgba(219, 84, 93, 1)',
                                },
                            }} checked={formData.sendSurvey} onClick={() => {
                                setFormData((prev) => ({
                                    ...prev,
                                    sendSurvey: !formData.sendSurvey
                                }))
                            }} />} label="Send survey at the end of an event" />
                        </div>
                    </div>
                    {formData.sendSurvey &&
                        <div className='mt-4'>
                            <div className="fieldHeader">
                                Survey question
                            </div>
                            <TextField id="outlined-basic"
                                variant="outlined"
                                size='small'
                                value={formData.surveyQuestion}
                                name='surveyQuestion'
                                onChange={handleValueChange}
                                placeholder='Enter survey question'
                                InputProps={{ sx: { borderRadius: '12px' } }}
                                fullWidth
                            />
                        </div>
                    }
                    <div className='mt-4'>
                        <div className="fieldHeader">
                            Remark
                        </div>
                        <TextField id="outlined-basic"
                            variant="outlined"
                            size='small'
                            placeholder='Enter remark'
                            InputProps={{ sx: { borderRadius: '12px' } }}
                            fullWidth
                        />
                    </div>
                    <div className='flex self-center gap-2 mt-6'>
                        <div >
                            <button className='filledBtn' onClick={() => { submit() }}>Submit</button>
                        </div>
                        <div >
                            <button className='outlineBtn' onClick={() => navigate('/eventList')}>Cancel</button>
                        </div>
                    </div>
                </div>
                <div className='hidden tablet1:flex' >
                    <img src={img1} style={{ width: '100%' }} className='self-end' />
                </div>
            </div>
            <ToastContainer />
        </div >
    )
}

export default AddEvent;