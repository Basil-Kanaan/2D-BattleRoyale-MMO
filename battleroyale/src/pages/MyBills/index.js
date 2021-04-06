import React, {useContext, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import "./styles.css"
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from 'react-datepicker';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment';
import {AuthContext} from '../../contexts/AuthContext';
//import { ArrowDropDown } from '@material-ui/icons';


//var querystring = require('querystring');

//const init_list = [];
const dayslist = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
    '13th',
    '14th',
    '15th',
    '16th',
    '17th',
    '18th',
    '19th',
    '20th',
    '21st',
    '22nd',
    '23rd',
    '24th',
    '25th',
    '26th',
    '27th',
    '28th',
    '29th',
    '30th',
    '31st',
];
const monthslist = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const typeofBill = [
    'Internet',
    'Food',
    'Electricity',
    'Phone',
    'Water',
    'Utilities',
    'Other',
];
const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(20),
    },
    cardGrid: {
        backgroundColor: "#BDC6D1",
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        backgroundColor: "#EDF2F4",
        color: '#2B2D42',
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        minHeight: 10,
    },
    menuitems: {
        height: 40,
        width: 100,
    },
    addBillButton: {
        width: 100,
        height: 100,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 100,
        fontSize: 70,
    },
    dropdown: {
        width: 200,
    },
    dropdownitems: {
        height: 40,
        width: 200,
    },
    billsmsg: {
        fontSize: 40,
        textAlign: 'center',
        marginTop: `${window.innerHeight/2}px`,
        // fontSize: 50,
        // position: 'absolute', 
        // left: '35%',
        // top: '50%',
        
    },
    nobillsmsg: {
        display: 'none',
    }

   
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MyBills = () => {
    const classes = useStyles();
    //bill list
    const [list, setList] = React.useState([]);
    //used to store the information for name, amount and other 
    const [name, setName] = React.useState('');
    const [billamt, setBillAmt] = React.useState('');
    const [category, setCategory] = React.useState('');
    //This is used to store new name, so we can look up by id, and edit that bill in the list
    const [idOfBill, setIdBill] = React.useState('');
    //used to open up the form
    const [open, setOpen] = React.useState(false);
    //another open to open the edit form
    const [openEdit, setOpenEdit] = React.useState(false);
    //used to open the sucessful snack bar
    const [openSnack, setopenSnack] = React.useState(false);
    //used for storing radio btn info and dates selected
    const [value, setValue] = React.useState('');
    const [day, setDay] = React.useState('');
    const [month, setMonth] = React.useState('');
    const [startDate, setStartDate] = React.useState(new Date());
    const [email, setEmail] = React.useState('');
    //Snack bars for invalid input fields (empty)
    const [noNameSnack, setNoNameSnack] = React.useState(false);
    const [noAmtSnack, setNoAmtSnack] = React.useState(false);
    const [noTypeSnack, setNoTypeSnack] = React.useState(false);
    const [noCategorySnack, setNoCategorySnack] = React.useState(false);
    //Snackbar for not selecting date, month, day
    const [noDateSnack, setNoDateSnack] = React.useState(false);
    const [noMonthSnack, setNoMonthSnack] = React.useState(false);
    const [noDaySnack, setNoDaySnack] = React.useState(false);
    //const {isAuth, updateAuth, updateToken} = useContext(AuthContext);

    const checkAuth = () => {
        fetch('http://localhost:8000/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data !== true) {
                window.location.href = "/";
            }
        }).catch(err => {
            console.log("Error");
        });
    }


    function handleRadio(e) {
        setValue(e.target.value);
    }

    function handleSelectDay(e) {
        setDay(e.target.value);
    }

    function handleSelectMonth(e) {
        setMonth(e.target.value);
    }

    function handleSelectDate(e) {
        setStartDate(e);
    }

    function handleNameChange(e) {
        // track input field's state
        setName(e.target.value);
    }


    function handleBillChange(e) {
        setBillAmt(e.target.value);
    }

    function handleOtherChange(e) {
        setCategory(e.target.value);
    }

    function getBills(email){
        var formBody = [];
        var encodedKey = encodeURIComponent("email");
        var encodedValue = encodeURIComponent(email);
        console.log("The email being retrieved: "+ email);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
        console.log(formBody);
        fetch('http://localhost:8000/api/user/bill', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                //email: email
            }
        }).then(response => response.json()).then(data => {
         
            console.log("data list: " + data);
            
            setList(data);
        }).catch(err => {
            alert(err);
        });


    }

    function handleEditedBill() {
        //make sure bill amt is numbers only
        let val = '';
        let transactionDate = '';
        let billday = '';
        let billmonth = '';
        if (billamt === '') {
            setNoAmtSnack(true);
            return;
        }
        if (isNaN(billamt) === true) {
            return;
        }
        //make sure store date, if type is clicked set other stuff to empty string
        if (value === 'transaction') {
            if (startDate !== null) {
                transactionDate = moment(startDate).format("yyyy-MM-DD");
                val = 'Transaction';
                billday = 'N/A';
                billmonth = 'N/A';
            } else {
                setNoDateSnack(true);
                return;
            }
        } else if (value === 'yearly') {
            if (day !== '' && month !== '') {
                billday = day;
                billmonth = month;
                val = 'Yearly';
                transactionDate = 'N/A';
            } else {
                if (day === '') {
                    setNoDaySnack(true);
                    return;
                } else if (month === '') {
                    setNoMonthSnack(true);
                    return;
                } else {
                    setNoDaySnack(true);
                    setNoMonthSnack(true);
                    return;
                }
            }
        } else if (value === 'monthly') {
            if (day !== '') {
                billday = day;
                val = 'Monthly';
                billmonth = 'N/A';
                transactionDate = 'N/A';
            } else {
                setNoDateSnack(true);
                return;
            }
        } else {
            setNoTypeSnack(true);
            return;
        }
        //ADD BILL INFO TO DB HERE
        console.log("ID OF THE BILL: " + idOfBill);
        const billJson = {
            billamt: billamt,
            day: billday,
            date: transactionDate,
            month: billmonth,
            type: val,
            _id: idOfBill
        }
        updateBill(billJson);
        setOpenEdit(false);

    }
    function getEmail(){
        fetch('http://localhost:8000/api/user/profile', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            getBills(data.email);
            setEmail(data.email);
            
        }).catch(err => {
            console.log("Error");
        });
    }

    function handleAdd() {
        // add name
        const dup = list.some(item => (item.name === name));
        let val = '';
        let transactionDate = '';
        let billday = '';
        let billmonth = '';

        if (name === '') {
            setNoNameSnack(true);
            return;
        }
        if (billamt === '') {
            setNoAmtSnack(true);
            return;
        }
        //make sure no dups
        if (name && dup === true) {
            return;
        }
        //make sure bill amt is numbers only
        if (isNaN(billamt) === true) {
            return;
        }
        //make sure the type of bill is selected
        if (category === '') {
            setNoCategorySnack(true);
            return;
        }

        //make sure store date, if type is clicked set other stuff to empty string
        if (value === 'transaction') {
            if (startDate !== null) {
                transactionDate = moment(startDate).format("yyyy-MM-DD");
                val = 'Transaction';
                billday = 'N/A';
                billmonth = 'N/A';
            } else {
                setNoDateSnack(true);
                return;
            }
        } else if (value === 'yearly') {
            if (day !== '' && month !== '') {
                billday = day;
                billmonth = month;
                val = 'Yearly';
                transactionDate = 'N/A';
            } else {
                if (day === '') {
                    setNoDaySnack(true);
                    return;
                } else if (month === '') {
                    setNoMonthSnack(true);
                    return;
                } else {
                    setNoDaySnack(true);
                    setNoMonthSnack(true);
                    return;
                }
            }
        } else if (value === 'monthly') {
            if (day !== '') {
                billday = day;
                val = 'Monthly';
                billmonth = 'N/A';
                transactionDate = 'N/A';
            } else {
                setNoDateSnack(true);
                return;
            }
        } else {
            setNoTypeSnack(true);
            return;
        }

        //Finished error checking, can add the info to bill
        setopenSnack(true);
        // const newBill = list.concat({
        //     name,
        //     id: uuidv4(),
        //     billamt: billamt,
        //     category: category,
        //     day: billday,
        //     date: transactionDate,
        //     month: billmonth,
        //     type: val
        // });
        //ADD BILL INFO TO DB HERE
        const billJson = {
            name,
            billamt: billamt,
            category: category,
            day: billday,
            date: transactionDate,
            month: billmonth,
            type: val,
            email: email
        }
        insertBill(billJson);
        //reset info and set the new list
        setName('');
        setBillAmt('');
        setCategory('');
        setOpen(false);
        setValue('');
        setDay('');
        setMonth('');
        setStartDate(new Date());
    }

    function updateBill(billJson) {
        var formBody = [];
        console.log(JSON.stringify(billJson));
        for (var property in billJson) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(billJson[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
       console.log(formBody);
    fetch('http://localhost:8000/api/bill', {
        method: 'PATCH',
        body: formBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response => response.json()).then(data => {
        getBills(email);
    }).catch(err => {
        alert("error");
    });   
    }

    function insertBill(billJson){
        var formBody = [];
        console.log(JSON.stringify(billJson));
            for (var property in billJson) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(billJson[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
        console.log(formBody);
        fetch('http://localhost:8000/api/bill', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            getBills(email);
        }).catch(err => {
            alert("error");
        });    
    }

    function deleteBill(id) {
        var formBody = [];
        // console.log(JSON.stringify(id));
        var encodedKey = encodeURIComponent("_id");
        var encodedValue = encodeURIComponent(id);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
       console.log(formBody);
    fetch('http://localhost:8000/api/bill', {
        method: 'DELETE',
        body: formBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then(response => response.json()).then(data => {
        getBills(email);
    }).catch(err => {
        alert("error");
    });   
    }

    function handleDelete(id) {
        //const deletedItemList = list.filter((item) => item._id !== id);
        deleteBill(id);
        getBills(email);
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpenEdit(id) {
        setIdBill(id);
        setOpenEdit(true);
    }

    function handleCloseEdit() {
        setOpenEdit(false);
    }

    //close all snackbars
    function handlecloseSnack() {
        setopenSnack(false);
        setNoNameSnack(false);
        setNoAmtSnack(false);
        setNoTypeSnack(false);
        setNoDateSnack(false);
        setNoMonthSnack(false);
        setNoDaySnack(false);
        setNoCategorySnack(false);
    }
    //if there are no bills then remove background
    function gridBackground(){
        if(list.length == 0){
            return "";
        }
        return classes.cardGrid;
    }

    useEffect(() => {
        getEmail();
        getBills(email);
        checkAuth();
    }, []);

    return (
        <div>
            <Container className={gridBackground()} maxWidth="md">
                <Grid container spacing={4}>
                    {list.map((item) => (
                        <Grid item key={item._id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {item.name}
                                    </Typography>
                                    <Typography >
                                        Bill Amount:
                                        {" " + item.billamt}
                                    </Typography>
                                    <Typography>
                                        Bill Category:
                                        {" " + item.category}
                                    </Typography>
                                    <Typography>
                                        Bill Payment Type:
                                        {" " + item.type}
                                    </Typography>
                                    <Typography>
                                        Bill Date:
                                        {" " + item.date}
                                    </Typography>
                                    <Typography>
                                        Bill Day:
                                        {" " + item.day}
                                    </Typography>
                                    <Typography>
                                        Bill Month:
                                        {" " + item.month}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton className={classes.icon} onClick={() => handleOpenEdit(item._id)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item._id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            
            <div>
            <DialogContent>
                        <DialogContentText className={list.length === 0 ? classes.billsmsg : classes.nobillsmsg}>
                            Click on the + button to add a bill
                        </DialogContentText>
            </DialogContent>
            </div>
            <div class='footer'>
                {/* <input type="text" value = {name} onChange={handleChange} />  */}
                <Button className={classes.addBillButton} type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}>+</Button>
                </div>

            {/* Create edit form here. CAN ONLY EDIT AMOUNT AND DATE TYPE*/}
            <div>
                <Dialog open={openEdit} onClose={handleCloseEdit} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Edit Bill </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a new amount for the bill:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            error={isNaN(billamt) === true}
                            helperText={isNaN(billamt) === true ? "Please enter a valid Number" : ''}
                            margin="dense"
                            id="amount"
                            label="Bill Amount"
                            onChange={handleBillChange}
                        />
                        <div class={classes.formControl}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Select the Payment type</FormLabel>
                                <RadioGroup aria-label="type" name="typebill" value={value} onChange={handleRadio}>
                                    <FormControlLabel value="transaction" control={<Radio/>} label="Transaction"/>
                                    <FormControlLabel value="yearly" control={<Radio/>} label="Yearly"/>
                                    <FormControlLabel value="monthly" control={<Radio/>} label="Monthly"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {/* Handle which date they select*/}
                        {(() => {
                            if (value === 'monthly') {
                                return (
                                    <div class={classes.formControl}>
                                        <InputLabel id="Day">Pick a day during the month: </InputLabel>
                                        <Select
                                            labelId="Day"
                                            id="day"
                                            value={day}
                                            onChange={handleSelectDay}
                                        >
                                            {/* Creating day items. Index starts at 0 ends at 30*/}
                                            {dayslist.map((value, index) => {
                                                return <MenuItem className={classes.menuitems}
                                                                 value={value}>{value}</MenuItem>
                                            })}
                                        </Select>
                                    </div>
                                )
                            } else if (value === 'yearly') {
                                return (
                                    <div class={classes.formControl}>
                                        <InputLabel class={classes.formControl} id="">Choose a month: </InputLabel>
                                        <Select
                                            labelId="Yearly"
                                            id="month"
                                            value={month}
                                            onChange={handleSelectMonth}
                                        >
                                            {/* Creating month items. Index starts at 0 ends at 11*/}
                                            {monthslist.map((value, index) => {
                                                return <MenuItem className={classes.menuitems}
                                                                 value={value}>{value}</MenuItem>
                                            })}
                                        </Select>
                                        <div>
                                            <InputLabel class={classes.formControl} id="Day">Pick a day during the
                                                month: </InputLabel>
                                            <Select
                                                labelId="Day"
                                                id="day"
                                                value={day}
                                                onChange={handleSelectDay}
                                            >
                                                {/* Creating day items. Index starts at 0 ends at 30*/}
                                                {dayslist.map((value, index) => {
                                                    return <MenuItem className={classes.menuitems}
                                                                     value={value}>{value}</MenuItem>
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                )
                            } else if (value === 'transaction') {
                                return (
                                    <div>
                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            popperPlacement="top-start"
                                            selected={startDate}
                                            onChange={handleSelectDate}
                                            isClearable
                                            placeholderText="Please choose a date"
                                        />
                                    </div>

                                )
                            } else {

                            }
                        })()}


                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEdit} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleEditedBill} type="submit" color="primary">
                            Save
                        </Button>
                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noAmtSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please enter a bill amount!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noTypeSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the type of bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noDaySnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the day for the bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noMonthSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the month for the bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noDateSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the date of bill!
                            </Alert>
                        </Snackbar>
                    </DialogActions>
                </Dialog>
            </div>


            {/* Create addbill form here*/}
            <div>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Bill</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name of the bill:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name of Bill"
                            onChange={handleNameChange}
                            error={name && list.some(item => (item.name === name)) === true}
                            helperText={name && list.some(item => (item.name === name)) === true ? "Bill name already exists!" : ''}
                        />
                        <DialogContentText>
                            Please enter the amount for the bill:
                        </DialogContentText>
                        <TextField
                            autoFocus
                            error={isNaN(billamt) === true}
                            helperText={isNaN(billamt) === true ? "Please enter a valid Number" : ''}
                            margin="dense"
                            id="amount"
                            label="Bill Amount"
                            onChange={handleBillChange}
                        />
                        <DialogContentText>
                            Please select the type of bill:
                        </DialogContentText>
                        <Select
                            autoFocus
                            // margin="dense"
                            labelId="Type"
                            className={classes.dropdown}
                            id="type"
                            value={category}
                            onChange={handleOtherChange}
                        >
                            {/* Creating day items. Index starts at 0 ends at 30*/}
                            {typeofBill.map((value, index) => {
                                return <MenuItem className={classes.dropdownitems}
                                                 value={value}>{value}</MenuItem>
                            })}
                        </Select>
                        <div class={classes.formControl}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Select the Payment type</FormLabel>
                                <RadioGroup aria-label="type" name="typebill" value={value} onChange={handleRadio}>
                                    <FormControlLabel value="transaction" control={<Radio/>} label="Transaction"/>
                                    <FormControlLabel value="yearly" control={<Radio/>} label="Yearly"/>
                                    <FormControlLabel value="monthly" control={<Radio/>} label="Monthly"/>
                                </RadioGroup>
                            </FormControl>
                        </div>

                        {/*Need to create bottom form when radio button clicked */}
                        {(() => {
                            if (value === 'monthly') {
                                return (
                                    // class = {classes.formControl}
                                    <div class={classes.formControl}>
                                        <InputLabel id="Day">Pick a day during the month: </InputLabel>
                                        <Select
                                            labelId="Day"
                                            id="day"
                                            value={day}
                                            onChange={handleSelectDay}
                                        >
                                            {/* Creating day items. Index starts at 0 ends at 30*/}
                                            {dayslist.map((value, index) => {
                                                return <MenuItem className={classes.menuitems}
                                                                 value={value}>{value}</MenuItem>
                                            })}
                                        </Select>
                                    </div>
                                )
                            } else if (value === 'yearly') {
                                return (
                                    <div class={classes.formControl}>
                                        <InputLabel class={classes.formControl} id="">Choose a month: </InputLabel>
                                        <Select
                                            labelId="Yearly"
                                            id="month"
                                            value={month}
                                            onChange={handleSelectMonth}
                                        >
                                            {/* Creating month items. Index starts at 0 ends at 11*/}
                                            {monthslist.map((value, index) => {
                                                return <MenuItem className={classes.menuitems}
                                                                 value={value}>{value}</MenuItem>
                                            })}
                                        </Select>
                                        <div>
                                            <InputLabel class={classes.formControl} id="Day">Pick a day during the
                                                month: </InputLabel>
                                            <Select
                                                labelId="Day"
                                                id="day"
                                                value={day}
                                                onChange={handleSelectDay}
                                            >
                                                {/* Creating day items. Index starts at 0 ends at 30*/}
                                                {dayslist.map((value, index) => {
                                                    return <MenuItem className={classes.menuitems}
                                                                     value={value}>{value}</MenuItem>
                                                })}
                                            </Select>
                                        </div>
                                    </div>
                                )
                            } else if (value === 'transaction') {
                                return (
                                    <div>
                                        <DatePicker
                                            dateFormat="yyyy-MM-dd"
                                            popperPlacement="top-start"
                                            selected={startDate}
                                            onChange={handleSelectDate}
                                            isClearable
                                            placeholderText="Please choose a date"
                                        />
                                    </div>

                                )
                            } else {

                            }
                        })()}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAdd} type="submit" color="primary">
                            Save
                        </Button>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noNameSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please enter a bill name!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noAmtSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please enter a bill amount!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noCategorySnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the type of bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noTypeSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the payment type!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noDaySnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the day for the bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noMonthSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the month for the bill!
                            </Alert>
                        </Snackbar>

                        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={noDateSnack}
                                  autoHideDuration={5000} onClose={handlecloseSnack}>
                            <Alert onClose={handlecloseSnack} severity="warning">
                                Please select the date of bill!
                            </Alert>
                        </Snackbar>

                    </DialogActions>

                </Dialog>

                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnack}
                          autoHideDuration={6000} onClose={handlecloseSnack}>
                    <Alert onClose={handlecloseSnack} severity="success">
                        Successfully added bill!
                    </Alert>
                </Snackbar>
            </div>

        </div>

    );
};

export default MyBills;