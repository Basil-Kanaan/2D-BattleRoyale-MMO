import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReviewCards from './ReviewCards';

export default function ScrollDialog() {
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [list, setList] = React.useState([]);

    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        getReviews();
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getReviews(){
        const company = "Bell";
        var formBody = [];
        var encodedKey = encodeURIComponent("company");
        var encodedValue = encodeURIComponent(company);
        console.log("The reviews are being retrieved: "+ company);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody = formBody.join("&");
        console.log(formBody);
        fetch('http://localhost:8000/api/reviewsCompany', {
            method: 'POST',
            body: formBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                //email: email
            }
        }).then(response => response.json()).then(data => {
            //console.log(data);
            // for(var i = 0; i <data.length; i++){
            //     init_list.push(data[i]);
            // }
            console.log("data list: " + data);
            setList(data);
        }).catch(err => {
            console.log(err);
            alert(err);
        });


    }
    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const {current: descriptionElement} = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button onClick={handleClickOpen('body')}>Reviews</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Reviews</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    {/* <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        
                    </DialogContentText> */}
                   {list.map((item) => (
                         <ReviewCards desc={item.description} rating={item.rating} name={item.email} />
                    ))}
                    
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    
                </DialogActions>
            </Dialog>
        </div>
    );
}