import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import DiscardPiles from '../components/DiscardPiles';
import DrawPile from '../components/DrawPile';

const styles = {
    root: {
        width: '100%',
        height: '10rem',
        backgroundColor: '#6D3F14',
    },
    spacing: {
        marginLeft: '5rem'
    }

};

const Board = (props) => {
    const { classes, discardPile, drawPile } = props;

    return (
        <Grid container alignItems="center" className={classes.root}>
            <DiscardPiles piles={discardPile} />
            <DrawPile className={classes.spacing} drawPile={drawPile} />
        </Grid>
    );
}

export default withStyles(styles)(Board);