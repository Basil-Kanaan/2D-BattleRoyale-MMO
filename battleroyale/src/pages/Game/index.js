import React, {useContext, useEffect} from "react";

// styles
// import useStyles from "./styles";
// components



export default function Game(props) {
    // var classes = useStyles();

    return ( 
        <div id="ui_play">
            <script src="jquery-3.5.1.min.js"/>
            <script type="module" language="javascript" src="controller.js"/>

            <canvas id="stage" width="1000" height="1000"/>

            <center>
                <button id="restart">Play Again</button>
            </center>
        </div>   

    );
}
