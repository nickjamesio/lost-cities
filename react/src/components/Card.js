import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Card images
import RedCardImage from '../images/red_card.jpg';
import GreenCardImage from '../images/green_card.jpg';
import YellowCardImage from '../images/yellow_card.jpg';
import WhiteCardImage from '../images/white_card.jpg';
import BlueCardImage from '../images/blue_card.jpg';
import BackCardImage from '../images/back_card.jpg';

const styles = {
    border: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '6rem',
        height: '7rem',
        backgroundColor: 'black'
    },
    image: {
        width: '5rem',
        height: '4rem',
        margin: '0.5rem'
    },
    imageBack: {
        width: '5rem',
        height: '6rem',
    },
    redBg: {
        backgroundColor: 'red'
    },
    greenBg: {
        backgroundColor: 'green'
    },
    blueBg: {
        backgroundColor: 'blue'
    },
    yellowBg: {
        backgroundColor: 'yellow'
    },
    whiteBg: {
        backgroundColor: 'white'
    },
    backBg: {
        backgroundImage: `url(${BackCardImage})`
    },
    redText: {
        color: 'red'
    },
    greenText: {
        color: 'green'
    },
    blueText: {
        color: 'blue'
    },
    yellowText: {
        color: 'yellow'
    },
    whiteText: {
        color: 'white'
    },
};

const Card = (props) => {
    const { classes, type, value } = props;
    const image = classNames(classes[`${type}Bg`], type == 'back' ? classes.imageBack : classes.image);
    const textColor = classes[`${type}Text`];

    return (
        <div className={classes.border}>
            {
                type != 'back'
                    ? <>
                        <Grid container justify="space-around">
                            <Typography variant="h6" className={textColor}>{value}</Typography>
                            <Typography variant="h6" className={textColor}>{value}</Typography>
                        </Grid>
                      </>
                    : null
            }
            <div className={image} />
        </div>
    );
};

Card.defaultProps = {
    value: ''
};

Card.propTypes = {
    type: PropTypes.oneOf(
        ['red', 'blue', 'white', 'green', 'yellow', 'back']
    ).isRequired,
};

export default withStyles(styles)(Card);