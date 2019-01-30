import React from 'react';
import { Grid, Button, Typography, withStyles } from '@material-ui/core';

const styles = {
    root: {
        backgroundColor: '#FFF7E1'
    }
};

const Header = (props) => {
    const { classes, currentPlayer, player } = props;

    return (
        <section>
            <Grid container className={classes.root} justify="space-between">
                <Typography variant="h5">
                    Current Player: { 'name' in currentPlayer ? currentPlayer.name : '' }
                </Typography>
                <Typography variant="h5">
                    Score: { player.score }
                </Typography>
                <Button variant="contained">
                    New Game
                </Button>
            </Grid>
        </section>
    );
};

export default withStyles(styles)(Header);