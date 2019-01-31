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
                const card = piles[color].length > 0 ? piles[color][piles[color].length - 1] : null
                return <DiscardPile type={color} card={card} />
            })}
        </div>
    );
};


export default withStyles(styles)(DiscardPiles);