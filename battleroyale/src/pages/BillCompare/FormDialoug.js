
import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { get } from 'mongoose';


export default function FormDialoug() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(2);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  
  };

  
  const addNewReview = () => {
    setOpen(false);
    var details = {
      'email': getEmail,
      'description': values.description,
      'rating': 1,
      'company': 'Bell',
  };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
     }
        formBody = formBody.join("&");
        fetch('http://localhost:8000/api/review', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(response => response.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
  }

  const [getEmail, setEmail] = React.useState(''); 
  const handleRating = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const getUserInfo = () => {
    fetch('http://localhost:8000/api/user/profile', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            jwt_token: localStorage.token
        }
    }).then(response => response.json()).then(data => {
        setEmail(data.email);
    }).catch(err => {
        console.log("Error");
    });
};
const [values, setValues] = React.useState({
  description: '',
  rating: '',
});

useEffect(() => {
  getUserInfo();
}, []);

  return (
    <div>
      {/* <Button variant="outlined" color="primary" >
        Open form dialog
      </Button> */}
      <Button
                size="medium"
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}>
                Add Review
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Review</DialogTitle>
        <DialogContent>
          <TextareaAutosize aria-label="maximum height" rowsMin={5} value={values.description} onChange={handleRating('description')} 
          placeholder="Write Review Here" />

        </DialogContent>
        
        <Box component="fieldset" mb={3} borderColor="transparent">
        <Typography component="legend">Rating</Typography>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            handleRating("rating")
          }}

        />
      </Box>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addNewReview} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/*  */}
    </div>
  );
}

