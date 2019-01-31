import React from 'react';
import { Grid, withStyles } from '@material-ui/core';
import DiscardPiles from '../components/DiscardPiles';

const styles = {
    root: {
        width: '100%',
        height: '12rem',
        backgroundColor: '#6D3F14',
    },
    container: {
        display: 'flex',
        maxWidth: '1000rem'
    },
};

const Board = (props) => {
    const { classes, discardPile } = props;

    return (
        <Grid container justify="space-between" alignItems="center" className={classes.root}>
            <DiscardPiles piles={discardPile} />
        </Grid>
    );
}

export default withStyles(styles)(Board);