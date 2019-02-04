import React from 'react';
import { withStyles } from '@material-ui/core';
import DiscardPile from '../components/DiscardPile';


const styles = {
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: '70rem',
        marginLeft: '10rem'
    }
};

const DiscardPiles = (props) => {
    const { classes, piles } = props;
    const pileOrder = ['red', 'green', 'white', 'blue', 'yellow'];

    return (
        <div className={classes.root}>
            {pileOrder.map(color => {
                return <DiscardPile color={color} cards={piles[color]} />
            })}
        </div>
    );
};


export default withStyles(styles)(DiscardPiles);